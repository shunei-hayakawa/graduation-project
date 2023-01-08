import { sleep } from "k6";
import http from "k6/http";

export const options = {
  vus: 1,
  duration: "200m",
};

const numbers = [7, 1, 6, 3, 8, 5, 2, 9, 2, 6, 1, 7, 8, 4, 8, 2, 5, 8, 7, 5];

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
