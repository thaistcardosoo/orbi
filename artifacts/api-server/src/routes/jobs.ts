import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { jobsTable, companiesTable } from "@workspace/db/schema";
import { eq, ilike, and, sql, type SQL } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const { search, location, modality, contractType, level, companyId, category, limit = "20", offset = "0" } = req.query;

    const conditions: SQL[] = [];

    if (search && typeof search === "string") {
      conditions.push(ilike(jobsTable.title, `%${search}%`));
    }
    if (location && typeof location === "string") {
      conditions.push(ilike(jobsTable.city, `%${location}%`));
    }
    if (modality && typeof modality === "string") {
      conditions.push(eq(jobsTable.modality, modality));
    }
    if (contractType && typeof contractType === "string") {
      conditions.push(eq(jobsTable.contractType, contractType));
    }
    if (level && typeof level === "string") {
      conditions.push(eq(jobsTable.level, level));
    }
    if (companyId) {
      conditions.push(eq(jobsTable.companyId, Number(companyId)));
    }
    if (category && typeof category === "string") {
      conditions.push(eq(jobsTable.category, category));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [jobs, countResult] = await Promise.all([
      db
        .select({
          id: jobsTable.id,
          title: jobsTable.title,
          slug: jobsTable.slug,
          companyId: jobsTable.companyId,
          companyName: companiesTable.name,
          companyLogo: companiesTable.logo,
          category: jobsTable.category,
          description: jobsTable.description,
          requirements: jobsTable.requirements,
          benefits: jobsTable.benefits,
          faq: jobsTable.faq,
          city: jobsTable.city,
          state: jobsTable.state,
          modality: jobsTable.modality,
          contractType: jobsTable.contractType,
          level: jobsTable.level,
          salaryMin: jobsTable.salaryMin,
          salaryMax: jobsTable.salaryMax,
          featured: jobsTable.featured,
          createdAt: jobsTable.createdAt,
        })
        .from(jobsTable)
        .leftJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
        .where(whereClause)
        .limit(Number(limit))
        .offset(Number(offset))
        .orderBy(jobsTable.featured, jobsTable.createdAt),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(jobsTable)
        .where(whereClause),
    ]);

    res.json({ jobs, total: countResult[0]?.count ?? 0 });
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

    const [job] = await db
      .select({
        id: jobsTable.id,
        title: jobsTable.title,
        slug: jobsTable.slug,
        companyId: jobsTable.companyId,
        companyName: companiesTable.name,
        companyLogo: companiesTable.logo,
        category: jobsTable.category,
        description: jobsTable.description,
        requirements: jobsTable.requirements,
        benefits: jobsTable.benefits,
        faq: jobsTable.faq,
        city: jobsTable.city,
        state: jobsTable.state,
        modality: jobsTable.modality,
        contractType: jobsTable.contractType,
        level: jobsTable.level,
        salaryMin: jobsTable.salaryMin,
        salaryMax: jobsTable.salaryMax,
        featured: jobsTable.featured,
        createdAt: jobsTable.createdAt,
      })
      .from(jobsTable)
      .leftJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
      .where(eq(jobsTable.id, id))
      .limit(1);

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    res.json(job);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
