export type DeploymentStatus =
  | "PENDING"
  | "SAVED_TO_S3"
  | "BUILDING"
  | "BUILD_COMPLETE"
  | "DEPLOYING_BUILD"
  | "DEPLOYED"
  | "FAILED";

export type Project = {
  id: string;
  githubUrl: string;
  projectDeploymentId: string;
  status: DeploymentStatus;
};

const requestHandlerUrl = process.env.NEXT_PUBLIC_REQUEST_HANDLER_URL;

export function getStatusLabel(status: DeploymentStatus) {
  if (status === "PENDING" || status === "SAVED_TO_S3") {
    return "Processing";
  }

  return status.replace(/_/g, " ");
}

export function getStatusTone(status: DeploymentStatus) {
  if (status === "DEPLOYED") return "is-deployed";
  if (status === "FAILED") return "is-failed";
  return "is-processing";
}

export function getStatusDescription(status: DeploymentStatus) {
  const descriptions: Record<DeploymentStatus, string> = {
    PENDING: "Your project is queued for processing.",
    SAVED_TO_S3: "Your source has been saved and is ready to build.",
    BUILDING: "Dependencies and build steps are running.",
    BUILD_COMPLETE: "Your build finished successfully.",
    DEPLOYING_BUILD: "Your build is being deployed globally.",
    DEPLOYED: "Your project is live and ready to share.",
    FAILED: "This deployment stopped with an error.",
  };

  return descriptions[status];
}

export function getLiveProjectUrl(deploymentId: string) {
  if (!requestHandlerUrl) {
    return null;
  }

  try {
    const url = new URL(requestHandlerUrl);
    url.hostname = `${deploymentId}.${url.hostname}`;
    return url.toString();
  } catch {
    const host = requestHandlerUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${deploymentId}.${host}`;
  }
}
