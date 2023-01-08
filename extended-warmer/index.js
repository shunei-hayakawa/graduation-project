import express from "express";
import { GoogleAuth } from "google-auth-library";
import { MetricServiceClient } from "@google-cloud/monitoring";
import { baseUrl, getTargetFunctions, projectNumber } from "./config.js";
import { getTrace, log } from "./logger.js";

const app = express();
app.use(express.json());
const auth = new GoogleAuth();
const metricClient = new MetricServiceClient();

app.post("/", async (req, res) => {
  const trace = getTrace(req);

  const targetFunctions = getTargetFunctions();
  const warmupRequests = [];
  targetFunctions.forEach(async (funcName) => {
    const [timeSeries] = await metricClient.listTimeSeries({
      name: `projects/${projectNumber}`,
      filter:
        'resource.type = "cloud_function" AND ' +
        `resource.labels.function_name = "${funcName}" AND ` +
        'metric.type = "cloudfunctions.googleapis.com/function/instance_count" AND ' +
        'metric.labels.state = "idle"',
      interval: {
        startTime: {
          seconds: Date.now() / 1000 - 60 * 5,
        },
        endTime: {
          seconds: Date.now() / 1000,
        },
      },
      aggregation: {
        alignmentPeriod: {
          seconds: 60,
        },
        perSeriesAligner: "ALIGN_SUM",
      },
      view: "FULL",
      pageSize: 1,
    });

    if (
      timeSeries.length === 0 ||
      timeSeries[0].points[0].value.int64Value === 0
    ) {
      warmupRequests.push(
        (async () => {
          const url = new URL(funcName, baseUrl);
          const client = await auth.getIdTokenClient(url.href);
          await client.request({
            url: url.href,
          });
          log("warmed up function", trace, funcName);
        })()
      );
    }
  });

  await Promise.all(warmupRequests);

  res.sendStatus(201);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on port", port);
});
