import { sleep } from "k6";
import http from "k6/http";

export const options = {
  vus: 1,
  duration: "101m",
};

const numbers = [1, 8, 6, 2, 3, 7, 4, 9, 5, 7, 1, 4, 7, 6, 2, 4, 9, 9, 3, 9];

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
