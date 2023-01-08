import express from "express";
import { GoogleAuth } from "google-auth-library";
import { baseUrl, getTargetFunctions } from "./config.js";
import { getTrace, log } from "./logger.js";

const app = express();
app.use(express.json());
const auth = new GoogleAuth();

app.post("/", async (req, res) => {
  const trace = getTrace(req);

  const targetFunctions = getTargetFunctions();
  const warmupRequests = [];
  targetFunctions.forEach((funcName) => {
    warmupRequests.push(
      (async () => {
        const url = new URL(funcName, baseUrl);
        const client = await auth.getIdTokenClient(url.href);
        await client.request({ url: url.href });
        log("warmed up function", trace, funcName);
      })()
    );
  });

  await Promise.all(warmupRequests);

  res.sendStatus(201);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on port", port);
});
