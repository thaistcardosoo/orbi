import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { companiesTable, jobsTable } from "@workspace/db/schema";
import { eq, ilike, and, sql, type SQL } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const { category, search, size, featured, limit = "20", offset = "0" } = req.query;

    const conditions: SQL[] = [];

    if (category && typeof category === "string") {
      conditions.push(eq(companiesTable.category, category));
    }
    if (search && typeof search === "string") {
      conditions.push(ilike(companiesTable.name, `%${search}%`));
    }
    if (size && typeof size === "string") {
      conditions.push(eq(companiesTable.size, size));
    }
    if (featured === "true") {
      conditions.push(eq(companiesTable.featured, true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [companies, countResult] = await Promise.all([
      db
        .select()
        .from(companiesTable)
        .where(whereClause)
        .limit(Number(limit))
        .offset(Number(offset))
        .orderBy(companiesTable.featured, companiesTable.name),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(companiesTable)
        .where(whereClause),
    ]);

    const jobCounts = await db
      .select({
        companyId: jobsTable.companyId,
        count: sql<number>`count(*)::int`,
      })
      .from(jobsTable)
      .groupBy(jobsTable.companyId);

    const jobCountMap = new Map(jobCounts.map((j) => [j.companyId, j.count]));

    const enriched = companies.map((c) => ({
      ...c,
      jobCount: jobCountMap.get(c.id) ?? 0,
    }));

    res.json({ companies: enriched, total: countResult[0]?.count ?? 0 });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const [company] = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.id, id))
      .limit(1);

    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    const [jobCountResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(jobsTable)
      .where(eq(jobsTable.companyId, id));

    res.json({ ...company, jobCount: jobCountResult?.count ?? 0 });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
