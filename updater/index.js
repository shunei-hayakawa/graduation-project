import { Firestore } from "@google-cloud/firestore";
import functions from "@google-cloud/functions-framework";

functions.http("updater", async (req, res) => {
  const firestore = new Firestore();
  const num = req.body["input"];
  await firestore.collection("numbers").doc("2RguHpush0cdNsycjjh5").update({
    value: num,
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  res.sendStatus(200);
});
