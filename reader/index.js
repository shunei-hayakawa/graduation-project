import { Firestore } from "@google-cloud/firestore";
import functions from "@google-cloud/functions-framework";

functions.http("reader", async (req, res) => {
  const firestore = new Firestore();
  await firestore.collection("numbers").doc("2RguHpush0cdNsycjjh5").get();

  res.sendStatus(200);
});
