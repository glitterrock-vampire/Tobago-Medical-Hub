import { Router } from "express";
import { patientsTable, appointmentsTable, servicesTable } from "@workspace/db/schema";
import { eq, ilike, or, sql, desc } from "drizzle-orm";
import {
  ListPatientsQueryParams,
  GetPatientParams,
  UpdatePatientParams,
  UpdatePatientBody,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/adminAuth";
import { getDb, isDatabaseNotConfiguredError } from "../lib/db";

const router = Router();

router.get("/patients", requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const parsed = ListPatientsQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    const baseQuery = db
      .select({
        id: patientsTable.id,
        firstName: patientsTable.firstName,
        lastName: patientsTable.lastName,
        email: patientsTable.email,
        phone: patientsTable.phone,
        address: patientsTable.address,
        notes: patientsTable.notes,
        createdAt: patientsTable.createdAt,
        totalAppointments: sql<number>`count(${appointmentsTable.id})::int`,
        lastVisit: sql<string | null>`max(${appointmentsTable.preferredDate})`,
      })
      .from(patientsTable)
      .leftJoin(appointmentsTable, eq(appointmentsTable.patientId, patientsTable.id))
      .groupBy(patientsTable.id)
      .orderBy(desc(patientsTable.createdAt));

    const rows = params.search
      ? await db
          .select({
            id: patientsTable.id,
            firstName: patientsTable.firstName,
            lastName: patientsTable.lastName,
            email: patientsTable.email,
            phone: patientsTable.phone,
            address: patientsTable.address,
            notes: patientsTable.notes,
            createdAt: patientsTable.createdAt,
            totalAppointments: sql<number>`count(${appointmentsTable.id})::int`,
            lastVisit: sql<string | null>`max(${appointmentsTable.preferredDate})`,
          })
          .from(patientsTable)
          .leftJoin(appointmentsTable, eq(appointmentsTable.patientId, patientsTable.id))
          .where(
            or(
              ilike(patientsTable.firstName, `%${params.search}%`),
              ilike(patientsTable.lastName, `%${params.search}%`),
              ilike(patientsTable.email, `%${params.search}%`),
              ilike(patientsTable.phone, `%${params.search}%`),
            ),
          )
          .groupBy(patientsTable.id)
          .orderBy(desc(patientsTable.createdAt))
      : await baseQuery;

    return res.json(rows);
  } catch (err) {
    if (isDatabaseNotConfiguredError(err)) {
      return res.json([]);
    }

    req.log.error({ err }, "Failed to list patients");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/patients/:id", requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const parsed = GetPatientParams.safeParse(req.params);
    if (!parsed.success) return res.status(400).json({ error: "Invalid id" });

    const [patient] = await db
      .select({
        id: patientsTable.id,
        firstName: patientsTable.firstName,
        lastName: patientsTable.lastName,
        email: patientsTable.email,
        phone: patientsTable.phone,
        address: patientsTable.address,
        notes: patientsTable.notes,
        createdAt: patientsTable.createdAt,
        totalAppointments: sql<number>`count(${appointmentsTable.id})::int`,
        lastVisit: sql<string | null>`max(${appointmentsTable.preferredDate})`,
      })
      .from(patientsTable)
      .leftJoin(appointmentsTable, eq(appointmentsTable.patientId, patientsTable.id))
      .groupBy(patientsTable.id)
      .where(eq(patientsTable.id, parsed.data.id));

    if (!patient) return res.status(404).json({ error: "Not found" });

    // Get appointment history
    const appointments = await db
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
      .where(eq(appointmentsTable.patientId, parsed.data.id))
      .orderBy(desc(appointmentsTable.createdAt));

    return res.json({ ...patient, appointments });
  } catch (err) {
    if (isDatabaseNotConfiguredError(err)) {
      return res.status(503).json({ error: "Database is not configured" });
    }

    req.log.error({ err }, "Failed to get patient");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/patients/:id", requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const paramsParsed = UpdatePatientParams.safeParse(req.params);
    if (!paramsParsed.success) return res.status(400).json({ error: "Invalid id" });
    const bodyParsed = UpdatePatientBody.safeParse(req.body);
    if (!bodyParsed.success) return res.status(400).json({ error: "Invalid body" });

    const [existing] = await db.select().from(patientsTable).where(eq(patientsTable.id, paramsParsed.data.id));
    if (!existing) return res.status(404).json({ error: "Not found" });

    await db
      .update(patientsTable)
      .set({ ...bodyParsed.data, updatedAt: new Date() })
      .where(eq(patientsTable.id, paramsParsed.data.id));

    const [updated] = await db
      .select({
        id: patientsTable.id,
        firstName: patientsTable.firstName,
        lastName: patientsTable.lastName,
        email: patientsTable.email,
        phone: patientsTable.phone,
        address: patientsTable.address,
        notes: patientsTable.notes,
        createdAt: patientsTable.createdAt,
        totalAppointments: sql<number>`count(${appointmentsTable.id})::int`,
        lastVisit: sql<string | null>`max(${appointmentsTable.preferredDate})`,
      })
      .from(patientsTable)
      .leftJoin(appointmentsTable, eq(appointmentsTable.patientId, patientsTable.id))
      .groupBy(patientsTable.id)
      .where(eq(patientsTable.id, paramsParsed.data.id));

    return res.json(updated);
  } catch (err) {
    if (isDatabaseNotConfiguredError(err)) {
      return res.status(503).json({ error: "Database is not configured" });
    }

    req.log.error({ err }, "Failed to update patient");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
