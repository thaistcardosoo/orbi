import { Router, type IRouter } from "express";
import healthRouter from "./health";
import companiesRouter from "./companies";
import jobsRouter from "./jobs";
import articlesRouter from "./articles";
import categoriesRouter from "./categories";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/companies", companiesRouter);
router.use("/jobs", jobsRouter);
router.use("/articles", articlesRouter);
router.use("/categories", categoriesRouter);
router.use("/stats", statsRouter);

export default router;
