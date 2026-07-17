import { Router } from "express";
import { db } from "@workspace/db";
import { servicesTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const router = Router();

router.get("/services", async (req, res) => {
  try {
    const services = await db
      .select()
      .from(servicesTable)
      .orderBy(asc(servicesTable.id));
    return res.json(services);
  } catch (err) {
    req.log.error({ err }, "Failed to list services");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
