const workflow = process.env.WORKFLOW;

export const projectId = "graduation-project-2-365804";

export const projectNumber = 497495416182;

export const baseUrl =
  "https://asia-northeast1-graduation-project-2-365804.cloudfunctions.net/";

export function getTargetFunctions() {
  switch (workflow) {
    case "extended-all":
      return ["extended-all_path-a", "extended-all_path-b"];

    case "extended-single":
      return ["extended-single_path-a"];

    default:
      return [];
  }
}
