import "dotenv/config";
import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.route.js";

const app = express();

app.set("port", (process.env.PORT || 8080));
app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json({}));

app.use((req, res, next) => {
    console.log("Gateway Received : ", req.method, req.url);
    next();
});

const baseAPI = "/api/v1";
app.use(`${baseAPI}/auth`, authRouter);

app.listen(app.get("port"), () => {
    console.log(`API Gateway running on port ${app.get("port")}`);
});