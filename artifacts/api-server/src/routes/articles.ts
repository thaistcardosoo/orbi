import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { articlesTable } from "@workspace/db/schema";
import { eq, type SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const { category, limit = "10", offset = "0" } = req.query;

    const conditions: SQL[] = [];
    if (category && typeof category === "string") {
      conditions.push(eq(articlesTable.category, category));
    }

    const whereClause = conditions.length > 0 ? conditions[0] : undefined;

    const [articles, countResult] = await Promise.all([
      db
        .select()
        .from(articlesTable)
        .where(whereClause)
        .limit(Number(limit))
        .offset(Number(offset))
        .orderBy(articlesTable.createdAt),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(articlesTable)
        .where(whereClause),
    ]);

    res.json({ articles, total: countResult[0]?.count ?? 0 });
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

    const [article] = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.id, id))
      .limit(1);

    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    res.json(article);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
