import { Router } from "express";
import { contactEnquiriesTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";
import { SubmitContactBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/adminAuth";
import { getDb, isDatabaseNotConfiguredError } from "../lib/db";

const router = Router();

router.post("/contact", async (req, res) => {
  try {
    const parsed = SubmitContactBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", issues: parsed.error.issues });
    }
    const db = await getDb();
    const [enquiry] = await db
      .insert(contactEnquiriesTable)
      .values(parsed.data)
      .returning();
    return res.status(201).json(enquiry);
  } catch (err) {
    if (isDatabaseNotConfiguredError(err)) {
      return res.status(503).json({ error: "Database is not configured" });
    }

    req.log.error({ err }, "Failed to submit contact enquiry");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contact/enquiries", requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const enquiries = await db
      .select()
      .from(contactEnquiriesTable)
      .orderBy(desc(contactEnquiriesTable.createdAt));
    return res.json(enquiries);
  } catch (err) {
    if (isDatabaseNotConfiguredError(err)) {
      return res.status(503).json({ error: "Database is not configured" });
    }

    req.log.error({ err }, "Failed to list enquiries");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
