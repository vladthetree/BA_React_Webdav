import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTOCOLL = "http";
const URL = "localhost";
const PORT = 8081;

const app = express();
app.use(express.json());
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; //https workaround


app.use(express.static(path.join(__dirname, "..", "dist")));

app.post("/someDomain", async(req,res)=> {
})


app.listen(PORT, () => {
  console.log(`Managerserver listen to ${PROTOCOLL}://${URL}:${PORT}`);
});
