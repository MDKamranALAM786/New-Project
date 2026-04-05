import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

import router from "./routes/auth.route.js";

const app = express();

const DB_URL = process.env.ATLASDB_URL;

app.set("port", (process.env.PORT || 5001));
app.use(express.urlencoded({extended : true}));
app.use(express.json({}));

app.use((req, res, next) => {
    console.log("Auth Service received : ", req.method, req.url);
    next();
});

const baseApi = "/api/v1";
app.use(`${baseApi}/auth`, router);

const start = async () => {
    try {
        const connectionDb = await mongoose.connect(DB_URL);
        console.log(`Connected to mongodb at ${connectionDb.connection.host}:${connectionDb.connection.port}`);
        
        app.listen(app.get("port"), () => {
            console.log(`Server running on port ${app.get("port")}`);
        });
    } catch(error) {
        console.log("Some Error Occurred");
        console.log(error);
    }
};
start();
