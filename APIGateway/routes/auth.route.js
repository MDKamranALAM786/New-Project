import {Router} from "express";
import {createProxyMiddleware} from "http-proxy-middleware";

const router = Router();

const AUTH_SERVICE_URL = "http://localhost:5001";


router.use((req, res, next) => {
    console.log("Gateway forwarding to ", req.method, req.url);
    next();
});

router.use(createProxyMiddleware({
    target : AUTH_SERVICE_URL,
    changeOrigin : true,
    pathRewrite : {
        "^/" : "/api/v1/auth"
    }
}));

export default router;
