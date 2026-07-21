import { Router } from "express";
import {
  appointmentsTable,
  patientsTable,
  servicesTable,
} from "@workspace/db/schema";
import { eq, and, ilike, or, sql, desc, gte, lte } from "drizzle-orm";
import {
  CreateAppointmentBody,
  UpdateAppointmentBody,
  UpdateAppointmentParams,
  GetAppointmentParams,
  DeleteAppointmentParams,
  ListAppointmentsQueryParams,
} from "@workspace/api-zod";
import { sendAppointmentNotification } from "../lib/email";
import { requireAdmin } from "../middlewares/adminAuth";
import { getDb, isDatabaseNotConfiguredError } from "../lib/db";
import { getDefaultServiceName } from "../lib/defaultServices";

const router = Router();

const emptyAppointmentStats = {
  totalToday: 0,
  totalThisWeek: 0,
  totalThisMonth: 0,
  totalPending: 0,
  totalConfirmed: 0,
  recentAppointments: [],
  byService: [],
};

// Helper: build full appointment object with joins
async function getAppointmentById(db: Awaited<ReturnType<typeof getDb>>, id: number) {
  const rows = await db
    .select({
      id: appointmentsTable.id,
      patientId: appointmentsTable.patientId,
      patientName: sql<string>`${patientsTable.firstName} || ' ' || ${patientsTable.lastName}`,
      patientEmail: patientsTable.email,
      patientPhone: patientsTable.phone,
      serviceId: appointmentsTable.serviceId,
      serviceName: servicesTable.name,
      preferredDate: appointmentsTable.preferredDate,
      preferredTime: appointmentsTable.preferredTime,
      status: appointmentsTable.status,
      isHomeVisit: appointmentsTable.isHomeVisit,
      address: appointmentsTable.address,
      notes: appointmentsTable.notes,
      staffNotes: appointmentsTable.staffNotes,
      createdAt: appointmentsTable.createdAt,
      updatedAt: appointmentsTable.updatedAt,
    })
    .from(appointmentsTable)
    .innerJoin(patientsTable, eq(appointmentsTable.patientId, patientsTable.id))
    .innerJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
    .where(eq(appointmentsTable.id, id))
    .limit(1);
  return rows[0] ?? null;
}

// GET /appointments — staff only
router.get("/appointments", requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const parsed = ListAppointmentsQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    const conditions = [];
    if (params.status) conditions.push(eq(appointmentsTable.status, params.status as any));
    if (params.date) {
      const dateStr = params.date instanceof Date
        ? params.date.toISOString().split("T")[0]
        : String(params.date);
      conditions.push(eq(appointmentsTable.preferredDate, dateStr));
    }
    if (params.search) {
      conditions.push(
        or(
          ilike(patientsTable.firstName, `%${params.search}%`),
          ilike(patientsTable.lastName, `%${params.search}%`),
          ilike(patientsTable.email, `%${params.search}%`),
        )!,
      );
    }

    const rows = await db
      .select({
        id: appointmentsTable.id,
        patientId: appointmentsTable.patientId,
        patientName: sql<string>`${patientsTable.firstName} || ' ' || ${patientsTable.lastName}`,
        patientEmail: patientsTable.email,
        patientPhone: patientsTable.phone,
        serviceId: appointmentsTable.serviceId,
        serviceName: servicesTable.name,
        preferredDate: appointmentsTable.preferredDate,
        preferredTime: appointmentsTable.preferredTime,
        status: appointmentsTable.status,
        isHomeVisit: appointmentsTable.isHomeVisit,
        address: appointmentsTable.address,
        notes: appointmentsTable.notes,
        staffNotes: appointmentsTable.staffNotes,
        createdAt: appointmentsTable.createdAt,
        updatedAt: appointmentsTable.updatedAt,
      })
      .from(appointmentsTable)
      .innerJoin(patientsTable, eq(appointmentsTable.patientId, patientsTable.id))
      .innerJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(appointmentsTable.createdAt));

    return res.json(rows);
  } catch (err) {
    if (isDatabaseNotConfiguredError(err)) {
      return res.json([]);
    }

    req.log.error({ err }, "Failed to list appointments");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /appointments — public
router.post("/appointments", async (req, res) => {
  try {
    const parsed = CreateAppointmentBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", issues: parsed.error.issues });
    }
    const body = parsed.data;
    const db = await getDb();

    // Upsert patient by email
    const existing = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.email, body.email))
      .limit(1);

    let patientId: number;
    if (existing.length > 0) {
      patientId = existing[0].id;
      // Update phone if changed
      await db
        .update(patientsTable)
        .set({ phone: body.phone, updatedAt: new Date() })
        .where(eq(patientsTable.id, patientId));
    } else {
      const [newPatient] = await db
        .insert(patientsTable)
        .values({
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          address: body.address ?? null,
        })
        .returning();
      patientId = newPatient.id;
    }

    const dateStr = body.preferredDate instanceof Date
      ? (body.preferredDate as Date).toISOString().split("T")[0]
      : String(body.preferredDate);

    const [appt] = await db
      .insert(appointmentsTable)
      .values({
        patientId,
        serviceId: body.serviceId,
        preferredDate: dateStr,
        preferredTime: body.preferredTime,
        status: "pending",
        isHomeVisit: body.isHomeVisit,
        address: body.address ?? null,
        notes: body.notes ?? null,
      })
      .returning();

    const full = await getAppointmentById(db, appt.id);
    if (full) {
      try {
        await sendAppointmentNotification(full);
      } catch (emailErr) {
        req.log.error(
          { err: emailErr, appointmentId: appt.id },
          "Failed to send appointment notification email",
        );
      }
    }
    return res.status(201).json(full);
  } catch (err) {
    if (isDatabaseNotConfiguredError(err)) {
      const parsed = CreateAppointmentBody.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request", issues: parsed.error.issues });
      }

      const body = parsed.data;
      const appointment = {
        id: Date.now(),
        patientId: 0,
        patientName: `${body.firstName} ${body.lastName}`,
        patientEmail: body.email,
        patientPhone: body.phone,
        serviceId: body.serviceId,
        serviceName: getDefaultServiceName(body.serviceId),
        preferredDate: body.preferredDate instanceof Date
          ? body.preferredDate.toISOString().split("T")[0]
          : String(body.preferredDate),
        preferredTime: body.preferredTime,
        status: "pending" as const,
        isHomeVisit: body.isHomeVisit,
        address: body.address ?? null,
        notes: body.notes ?? null,
        staffNotes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        await sendAppointmentNotification(appointment);
      } catch (emailErr) {
        req.log.error({ err: emailErr }, "Failed to send appointment notification email");
        return res.status(503).json({ error: "Appointment email is not configured" });
      }

      req.log.warn("Database is not configured; appointment notification was emailed without persistence");
      return res.status(202).json(appointment);
    }

    req.log.error({ err }, "Failed to create appointment");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /appointments/stats — staff only
router.get("/appointments/stats", requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

    const [todayCount, weekCount, monthCount, pendingCount, confirmedCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(appointmentsTable)
        .where(eq(appointmentsTable.preferredDate, todayStr)),
      db.select({ count: sql<number>`count(*)::int` }).from(appointmentsTable)
        .where(gte(appointmentsTable.preferredDate, weekStartStr)),
      db.select({ count: sql<number>`count(*)::int` }).from(appointmentsTable)
        .where(gte(appointmentsTable.preferredDate, monthStart)),
      db.select({ count: sql<number>`count(*)::int` }).from(appointmentsTable)
        .where(eq(appointmentsTable.status, "pending")),
      db.select({ count: sql<number>`count(*)::int` }).from(appointmentsTable)
        .where(eq(appointmentsTable.status, "confirmed")),
    ]);

    // Recent 5 appointments
    const recent = await db
      .select({
        id: appointmentsTable.id,
        patientId: appointmentsTable.patientId,
        patientName: sql<string>`${patientsTable.firstName} || ' ' || ${patientsTable.lastName}`,
        patientEmail: patientsTable.email,
        patientPhone: patientsTable.phone,
        serviceId: appointmentsTable.serviceId,
        serviceName: servicesTable.name,
        preferredDate: appointmentsTable.preferredDate,
        preferredTime: appointmentsTable.preferredTime,
        status: appointmentsTable.status,
        isHomeVisit: appointmentsTable.isHomeVisit,
        address: appointmentsTable.address,
        notes: appointmentsTable.notes,
        staffNotes: appointmentsTable.staffNotes,
        createdAt: appointmentsTable.createdAt,
        updatedAt: appointmentsTable.updatedAt,
      })
      .from(appointmentsTable)
      .innerJoin(patientsTable, eq(appointmentsTable.patientId, patientsTable.id))
      .innerJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
      .orderBy(desc(appointmentsTable.createdAt))
      .limit(5);

    // By service
    const byService = await db
      .select({
        serviceName: servicesTable.name,
        count: sql<number>`count(*)::int`,
      })
      .from(appointmentsTable)
      .innerJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
      .groupBy(servicesTable.name)
      .orderBy(desc(sql`count(*)`));

    return res.json({
      totalToday: todayCount[0]?.count ?? 0,
      totalThisWeek: weekCount[0]?.count ?? 0,
      totalThisMonth: monthCount[0]?.count ?? 0,
      totalPending: pendingCount[0]?.count ?? 0,
      totalConfirmed: confirmedCount[0]?.count ?? 0,
      recentAppointments: recent,
      byService,
    });
  } catch (err) {
    if (isDatabaseNotConfiguredError(err)) {
      return res.json(emptyAppointmentStats);
    }

    req.log.error({ err }, "Failed to get appointment stats");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /appointments/:id — staff only
router.get("/appointments/:id", requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const parsed = GetAppointmentParams.safeParse(req.params);
    if (!parsed.success) return res.status(400).json({ error: "Invalid id" });
    const appt = await getAppointmentById(db, parsed.data.id);
    if (!appt) return res.status(404).json({ error: "Not found" });
    return res.json(appt);
  } catch (err) {
    if (isDatabaseNotConfiguredError(err)) {
      return res.status(503).json({ error: "Database is not configured" });
    }

    req.log.error({ err }, "Failed to get appointment");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /appointments/:id — staff only
router.patch("/appointments/:id", requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const paramsParsed = UpdateAppointmentParams.safeParse(req.params);
    if (!paramsParsed.success) return res.status(400).json({ error: "Invalid id" });
    const bodyParsed = UpdateAppointmentBody.safeParse(req.body);
    if (!bodyParsed.success) return res.status(400).json({ error: "Invalid body" });

    const { id } = paramsParsed.data;
    const rawUpdates = bodyParsed.data;
    const updates: Record<string, unknown> = { ...rawUpdates, updatedAt: new Date() };
    if (rawUpdates.preferredDate !== undefined) {
      updates.preferredDate = rawUpdates.preferredDate instanceof Date
        ? (rawUpdates.preferredDate as Date).toISOString().split("T")[0]
        : String(rawUpdates.preferredDate);
    }

    const existing = await db.select().from(appointmentsTable).where(eq(appointmentsTable.id, id)).limit(1);
    if (!existing.length) return res.status(404).json({ error: "Not found" });

    await db
      .update(appointmentsTable)
      .set(updates as any)
      .where(eq(appointmentsTable.id, id));

    const full = await getAppointmentById(db, id);
    return res.json(full);
  } catch (err) {
    if (isDatabaseNotConfiguredError(err)) {
      return res.status(503).json({ error: "Database is not configured" });
    }

    req.log.error({ err }, "Failed to update appointment");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /appointments/:id — staff only
router.delete("/appointments/:id", requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const parsed = DeleteAppointmentParams.safeParse(req.params);
    if (!parsed.success) return res.status(400).json({ error: "Invalid id" });
    await db.delete(appointmentsTable).where(eq(appointmentsTable.id, parsed.data.id));
    return res.status(204).send();
  } catch (err) {
    if (isDatabaseNotConfiguredError(err)) {
      return res.status(503).json({ error: "Database is not configured" });
    }

    req.log.error({ err }, "Failed to delete appointment");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
