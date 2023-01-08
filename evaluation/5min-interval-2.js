import { sleep } from "k6";
import http from "k6/http";

export const options = {
  vus: 1,
  duration: "101m",
};

const numbers = [9, 6, 6, 4, 6, 1, 7, 7, 1, 8, 1, 9, 1, 6, 8, 2, 9, 7, 1, 9];

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
  sleep(300);
}
