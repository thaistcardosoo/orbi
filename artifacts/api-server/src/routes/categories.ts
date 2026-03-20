import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { companiesTable } from "@workspace/db/schema";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

const CATEGORIES = [
  { id: 1, name: "Tech", slug: "tech" },
  { id: 2, name: "Marketing", slug: "marketing" },
  { id: 3, name: "Design", slug: "design" },
  { id: 4, name: "Produto", slug: "produto" },
  { id: 5, name: "Dados & IA", slug: "dados" },
  { id: 6, name: "Consultoria", slug: "consultoria" },
  { id: 7, name: "Fintech", slug: "fintech" },
  { id: 8, name: "Edtech", slug: "edtech" },
  { id: 9, name: "Healthtech", slug: "healthtech" },
];

router.get("/", async (req, res) => {
  try {
    const companyCounts = await db
      .select({
        category: companiesTable.category,
        count: sql<number>`count(*)::int`,
      })
      .from(companiesTable)
      .groupBy(companiesTable.category);

    const countMap = new Map(companyCounts.map((c) => [c.category, c.count]));

    const categories = CATEGORIES.map((cat) => ({
      ...cat,
      companyCount: countMap.get(cat.slug) ?? 0,
    }));

    res.json({ categories });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
