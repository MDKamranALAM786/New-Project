import {Router} from "express";
import {createProxyMiddleware} from "http-proxy-middleware";

const router = Router();

const AUTH_SERVICE_URL = "http://localhost:5001";

router.use((req, res, next) => {
    console.log("Gateway forwarding to ", req.method, req.url);
    next();
});

router.use("/", createProxyMiddleware({
    target : AUTH_SERVICE_URL,
    changeOrigin : true,
    on : {
        proxyReq : (proxyReq, req, res) => {
            const newPath = `/api/v1/auth${req.url}`;
            proxyReq.path = newPath;
        }
    }
}));

export default router;
