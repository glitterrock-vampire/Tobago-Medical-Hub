import { Router } from "express";
import { db } from "@workspace/db";
import { contactEnquiriesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { SubmitContactBody } from "@workspace/api-zod";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  next();
};

router.post("/contact", async (req, res) => {
  try {
    const parsed = SubmitContactBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", issues: parsed.error.issues });
    }
    const [enquiry] = await db
      .insert(contactEnquiriesTable)
      .values(parsed.data)
      .returning();
    return res.status(201).json(enquiry);
  } catch (err) {
    req.log.error({ err }, "Failed to submit contact enquiry");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contact/enquiries", requireAuth, async (req, res) => {
  try {
    const enquiries = await db
      .select()
      .from(contactEnquiriesTable)
      .orderBy(desc(contactEnquiriesTable.createdAt));
    return res.json(enquiries);
  } catch (err) {
    req.log.error({ err }, "Failed to list enquiries");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
