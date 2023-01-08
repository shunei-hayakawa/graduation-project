import { sleep } from "k6";
import http from "k6/http";

export const options = {
  vus: 1,
  duration: "200m",
};

const numbers = [7, 1, 4, 7, 7, 7, 1, 3, 4, 3, 7, 1, 6, 4, 5, 9, 8, 5, 8, 2];

const workflows = [
  "base",
  "naive-all",
  "naive-single",
  "extended-all",
  "extended-single",
];

let counter = 0;

export default function () {
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  workflows.forEach((workflow) => {
    http.post(
      "http://localhost:8080",
      JSON.stringify({ num: numbers[counter], workflow: workflow }),
      params
    );
  });
  counter++;
  sleep(600);
}
