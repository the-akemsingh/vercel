import Link from "next/link";
import { ArrowUpRightIcon, GitBranchIcon, GlobeIcon, ShieldIcon } from "./icons";
import { getLiveProjectUrl, getStatusLabel, getStatusTone, type Project } from "./project-status";

export function ProjectCard({ project }: { project: Project }) {
  const liveUrl = project.status === "DEPLOYED" ? getLiveProjectUrl(project.projectDeploymentId) : null;
  const statusTone = getStatusTone(project.status);

  return (
    <article className="project-card">
      <div className="project-card__topline">
        <span className={`project-card__status ${statusTone}`}>
          <i aria-hidden="true" />
          {getStatusLabel(project.status)}
        </span>
        <span className="project-card__deployment-id">#{project.projectDeploymentId}</span>
      </div>

      <div className="project-card__repo">
        <GitBranchIcon />
        <p title={project.githubUrl}>{project.githubUrl}</p>
      </div>

      <div className="project-card__actions">
        <Link href={`/app/${encodeURIComponent(project.projectDeploymentId)}`} className="project-card__details-link">
          Project details <ArrowUpRightIcon />
        </Link>
        {liveUrl ? (
          <a className="project-card__live-link" href={liveUrl} target="_blank" rel="noreferrer">
            <GlobeIcon />
            Open live site
          </a>
        ) : (
          <span className="project-card__pending-link"><ShieldIcon /> Deployment in progress</span>
        )}
      </div>
    </article>
  );
}
