const workflow = process.env.WORKFLOW;

export const projectId = "graduation-project-2-365804";

export const baseUrl =
  "https://asia-northeast1-graduation-project-2-365804.cloudfunctions.net/";

export function getTargetFunctions() {
  switch (workflow) {
    case "naive-all":
      return ["naive-all_path-a", "naive-all_path-b"];

    case "naive-single":
      return ["naive-single_path-a"];

    default:
      return [];
  }
}
