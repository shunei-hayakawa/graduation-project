import { projectId } from "./config.js";

export function getTrace(request) {
  const traceHeader = request.header("X-Cloud-Trace-Context");
  if (typeof traceHeader === "undefined") {
    return "";
  }
  const [trace] = traceHeader.split("/");
  return `projects/${projectId}/traces/${trace}`;
}

export function log(message, trace, component) {
  console.log(
    JSON.stringify({
      severity: "INFO",
      message,
      "logging.googleapis.com/trace": trace,
      component,
    })
  );
}
