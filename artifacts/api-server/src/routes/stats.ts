import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { companiesTable, jobsTable } from "@workspace/db/schema";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const [[companiesResult], [jobsResult], [citiesResult]] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(companiesTable),
      db.select({ count: sql<number>`count(*)::int` }).from(jobsTable),
      db.select({ count: sql<number>`count(distinct city)::int` }).from(companiesTable),
    ]);

    res.json({
      totalJobs: jobsResult?.count ?? 0,
      totalCompanies: companiesResult?.count ?? 0,
      totalCandidates: 12847,
      totalCities: citiesResult?.count ?? 0,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
