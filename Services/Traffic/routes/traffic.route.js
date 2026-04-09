import {Router} from "express";

import {changeTrafficHandler} from "../controllers/trafficController.js";

const router = Router();
router.use((req, res, next) => {
    console.log(`Router forwarding ${req.method} request to ${req.url}`);
    next();
});

router.route("/update").post(changeTrafficHandler);

export default router;
