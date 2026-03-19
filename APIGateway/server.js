import "dotenv/config";
import express from "express";
import cors from "cors";

import router from "./routes/route.js";

const app = express();

app.set("port", (process.env.PORT || 8080));
app.use(cors());

app.use((req, res, next) => {
    console.log("Gateway Received : ", req.method, req.url);
    next();
});

const baseAPI = "/api/v1";
// app.use(`${baseAPI}/auth`, authRouter);
app.use("/api/v1", router);

app.listen(app.get("port"), () => {
    console.log(`API Gateway running on port ${app.get("port")}`);
});
