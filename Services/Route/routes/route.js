import {Router} from "express";

import {getRouteHandler} from "../controllers/routeController.js";

const router = Router();
router.route("/route").get(getRouteHandler);

export default router;
