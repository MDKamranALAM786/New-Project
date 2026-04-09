import "dotenv/config";
import neo4j from "neo4j-driver";

const URL = process.env.URL;
const user = process.env.USER;
const password = process.env.PASSWORD;

let driver = neo4j.driver(
    URL,
    neo4j.auth.basic(user, password)
);

export default driver;
