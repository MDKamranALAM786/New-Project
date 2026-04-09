import {Router} from "express";

import authRouter from "./auth.route.js";
import routeRouter from "./route.route.js";
import trafficRoute from "./traffic.route.js";

const router = Router();
router.use((req, res, next) => {
    console.log(`${req.method} request received by gateway router at ${req.url}`);
    next();
});

router.use("/auth", authRouter);
router.use("/route", routeRouter);
router.use("/traffic", trafficRoute);

export default router;
