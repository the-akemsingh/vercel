import { ProjectDetailsShell } from "../../components/project-details-shell";

export default async function ProjectPage({ params }: PageProps<"/app/[projectDeploymentId]">) {
  const { projectDeploymentId } = await params;
  return <ProjectDetailsShell projectDeploymentId={projectDeploymentId} />;
}
