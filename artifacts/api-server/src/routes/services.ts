import { Router } from "express";
import { servicesTable } from "@workspace/db/schema";
import { asc } from "drizzle-orm";
import { getDb, isDatabaseNotConfiguredError } from "../lib/db";
import { defaultServices } from "../lib/defaultServices";

const router = Router();

router.get("/services", async (req, res) => {
  try {
    const db = await getDb();
    const services = await db
      .select()
      .from(servicesTable)
      .orderBy(asc(servicesTable.id));
    return res.json(services);
  } catch (err) {
    if (isDatabaseNotConfiguredError(err)) {
      req.log.warn("Database is not configured; returning default services");
      return res.json(defaultServices);
    }

    req.log.error({ err }, "Failed to list services");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
