import functions from "@google-cloud/functions-framework";
import { PubSub } from "@google-cloud/pubsub";

const workflow = process.env.WORKFLOW;

functions.http("starter", async (req, res) => {
  const pubsub = new PubSub();
  const topic = pubsub.topic(workflow);
  await topic.publishMessage({ data: Buffer.from("begin workflow") });
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  res.status(201).json({ data: req.body["input"] });
});
