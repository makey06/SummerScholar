import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profileRouter from "./profile";
import categoriesRouter from "./categories";
import lessonsRouter from "./lessons";
import progressRouter from "./progress";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profileRouter);
router.use(categoriesRouter);
router.use(lessonsRouter);
router.use(progressRouter);
router.use(statsRouter);

export default router;
