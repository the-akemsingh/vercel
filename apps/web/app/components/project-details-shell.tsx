"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRightIcon, GitBranchIcon, GlobeIcon, ShieldIcon } from "./icons";
import { getLiveProjectUrl, getStatusDescription, getStatusLabel, getStatusTone, type Project } from "./project-status";
import { useAuthSession } from "./auth-session";

const projectApiUrl = `${(process.env.NEXT_PUBLIC_UPLOAD_SERVICE_URL ?? "http://localhost:3001/api/v1")}/project`;

export function ProjectDetailsShell({ projectDeploymentId }: { projectDeploymentId: string }) {
  const { ready, session } = useAuthSession();
  const [project, setProject] = useState<Project | null>(null);
  const [message, setMessage] = useState("Loading project…");

  const fetchProject = useCallback(async () => {
    if (!session) return;

    try {
      const response = await fetch(`${projectApiUrl}/all`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      const payload = (await response.json()) as { projects?: Project[]; message?: string };
      if (!response.ok) throw new Error(payload.message ?? "Unable to load this project.");

      const matchingProject = payload.projects?.find((item) => item.projectDeploymentId === projectDeploymentId) ?? null;
      setProject(matchingProject);
      setMessage(matchingProject ? "" : "This project was not found in your workspace.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load this project.");
    }
  }, [projectDeploymentId, session]);

  useEffect(() => {
    if (!ready || !session) return;
    fetchProject();
    const intervalId = window.setInterval(fetchProject, 20_000);
    return () => window.clearInterval(intervalId);
  }, [fetchProject, ready, session]);

  if (!ready || !session) return <main className="workspace-page workspace-page--guard" aria-busy="true" />;

  if (!project) {
    return (
      <main className="workspace-page">
        <section className="project-details project-details--empty">
          <p>{message}</p>
          <Link href="/app">Back to projects</Link>
        </section>
      </main>
    );
  }

  const liveUrl = project.status === "DEPLOYED" ? getLiveProjectUrl(project.projectDeploymentId) : null;
  const statusTone = getStatusTone(project.status);

  return (
    <main className="workspace-page">
      <section className="project-details">
        <Link href="/app" className="project-details__back">← All projects</Link>
        <div className="project-details__header">
          <div>
            <p className="workspace-shell__eyebrow">Deployment #{project.projectDeploymentId}</p>
            <h1>{getStatusLabel(project.status)}</h1>
            <p>{getStatusDescription(project.status)}</p>
          </div>
          <span className={`project-card__status ${statusTone}`}><i aria-hidden="true" />{getStatusLabel(project.status)}</span>
        </div>

        <div className="project-details__info">
          <div><GitBranchIcon /><span>Repository</span><strong>{project.githubUrl}</strong></div>
          <div><ShieldIcon /><span>Status</span><strong>{getStatusLabel(project.status)}</strong></div>
        </div>

        {liveUrl ? (
          <a className="project-details__live-link" href={liveUrl} target="_blank" rel="noreferrer">
            <span className="project-details__live-pulse" aria-hidden="true" />
            <div><span>Live project URL</span><strong>{liveUrl}</strong></div>
            <GlobeIcon /><ArrowUpRightIcon />
          </a>
        ) : null}
      </section>
    </main>
  );
}
