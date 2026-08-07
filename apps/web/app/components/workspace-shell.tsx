"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRightIcon, GitBranchIcon, ShieldIcon } from "./icons";
import { ProjectCard } from "./project-card";
import { useAuthSession } from "./auth-session";
import type { DeploymentStatus, Project } from "./project-status";

const backendUrl = (process.env.NEXT_PUBLIC_UPLOAD_SERVICE_URL ?? "http://localhost:3001/api/v1").replace(/\/$/, "");
const pollIntervalMs = 20_000;
const statusSteps: Array<{ key: DeploymentStatus; label: string; description: string }> = [
  { key: "PENDING", label: "Pending", description: "Queued for processing." },
  { key: "SAVED_TO_S3", label: "Saved", description: "Project copied to storage." },
  { key: "BUILDING", label: "Building", description: "Dependencies and build steps are running." },
  { key: "BUILD_COMPLETE", label: "Built", description: "Build finished successfully." },
  { key: "DEPLOYING_BUILD", label: "Deploying", description: "Final deployment is in progress." },
  { key: "DEPLOYED", label: "Live", description: "Deployment completed." },
  { key: "FAILED", label: "Failed", description: "Deployment stopped with an error." },
];

function getStageTone(status: DeploymentStatus) {
  if (status === "FAILED") return "is-failed";
  if (status === "DEPLOYED") return "is-complete";
  return "is-active";
}

function getStatusLabel(status: DeploymentStatus) {
  if (status === "PENDING" || status === "SAVED_TO_S3") {
    return "Processing";
  }

  return status.replace(/_/g, " ");
}

export function WorkspaceShell() {
  const router = useRouter();
  const { ready, session } = useAuthSession();
  const [githubUrl, setGithubUrl] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectDeploymentId, setProjectDeploymentId] = useState<string | null>(null);
  const [status, setStatus] = useState<DeploymentStatus | null>(null);
  const [message, setMessage] = useState<string>("Paste a public GitHub repository to publish it.");
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!session) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/project/all`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Projects request failed with ${response.status}`);
      }

      const payload = (await response.json()) as { projects?: Project[] };
      setProjects(payload.projects ?? []);
    } catch {
      setProjects([]);
    }
  }, [session]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!session) {
      router.replace("/");
    }
  }, [ready, router, session]);

  useEffect(() => {
    if (!ready || !session) {
      return;
    }

    fetchProjects();
    const intervalId = window.setInterval(fetchProjects, pollIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [fetchProjects, ready, session]);

  useEffect(() => {
    if (!projectDeploymentId || !session) {
      return;
    }

    let isActive = true;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`${backendUrl}/project/status/${projectDeploymentId}`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Status request failed with ${response.status}`);
        }

        const payload = (await response.json()) as { status?: DeploymentStatus };
        if (isActive && payload.status) {
          setStatus(payload.status);
          setMessage(`Current stage: ${payload.status.replace(/_/g, " ").toLowerCase()}.`);
        }
      } catch (error) {
        if (isActive) {
          setMessage(error instanceof Error ? error.message : "Unable to fetch deployment status.");
        }
      }
    };

    fetchStatus();
    const intervalId = window.setInterval(fetchStatus, pollIntervalMs);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [projectDeploymentId, session]);

  const activeProject = useMemo(
    () => projects.find((project) => project.projectDeploymentId === projectDeploymentId) ?? null,
    [projectDeploymentId, projects],
  );
  const activeStatus = status ?? activeProject?.status ?? null;
  const currentStep = useMemo(() => statusSteps.find((step) => step.key === activeStatus), [activeStatus]);

  async function publishProject() {
    if (!githubUrl.trim()) {
      setMessage("Enter a public GitHub repository URL first.");
      return;
    }

    if (!session) {
      router.replace("/");
      return;
    }

    setIsPublishing(true);
    setMessage("Publishing your repository…");

    try {
      const response = await fetch(`${backendUrl}/project/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ projectUrl: githubUrl.trim() }),
      });

      const payload = (await response.json()) as { projectDeploymentId?: string; message?: string };

      if (!response.ok || !payload.projectDeploymentId) {
        throw new Error(payload.message ?? "Upload failed.");
      }

      setProjectDeploymentId(payload.projectDeploymentId);
      setStatus("PENDING");
      setMessage(`Deployment id ${payload.projectDeploymentId} created. Checking progress…`);
      await fetchProjects();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to publish the repository.");
    } finally {
      setIsPublishing(false);
    }
  }

  if (!ready || !session) {
    return <main className="workspace-page workspace-page--guard" aria-busy="true" />;
  }

  return (
    <main className="workspace-page">
      <section className="workspace-shell">
        <div className="workspace-shell__heading">
          <p className="workspace-shell__eyebrow">Project workspace</p>
          <h1>Hi, {session.user.name}</h1>
          <p>Enter a public GitHub repository link and publish it to start deployment.</p>
        </div>

        <div className="workspace-shell__composer">
          <label className="workspace-shell__label" htmlFor="github-url">
            Enter the GitHub link of your public repo.
          </label>
          <div className="workspace-shell__input-row">
            <input
              id="github-url"
              type="url"
              value={githubUrl}
              onChange={(event) => setGithubUrl(event.target.value)}
              placeholder="https://github.com/owner/repository"
            />
            <button type="button" className="workspace-shell__publish" onClick={publishProject} disabled={isPublishing}>
              {isPublishing ? "Publishing…" : "Publish"}
              <ArrowUpRightIcon />
            </button>
          </div>
          <p className="workspace-shell__message" aria-live="polite">
            {message}
          </p>
        </div>

        <div className="workspace-shell__status-panel">
          <div className="workspace-shell__status-header">
            <div>
              <p className="workspace-shell__status-kicker">Deployment status</p>
              <h2>{activeStatus ? getStatusLabel(activeStatus) : "Waiting for your first publish"}</h2>
            </div>
            <div className={`workspace-shell__status-pill ${activeStatus ? getStageTone(activeStatus) : "is-idle"}`}>
              <ShieldIcon />
              <span>{activeStatus ? getStatusLabel(activeStatus) : "Idle"}</span>
            </div>
          </div>

          {currentStep && activeStatus ? (
            <div className={`workspace-shell__progress ${getStageTone(activeStatus)}`}>
              <div className="workspace-shell__step is-active">
                <span className="workspace-shell__step-spinner" aria-hidden="true" />
                <div>
                  <strong>{getStatusLabel(activeStatus)}</strong>
                  <p>{currentStep.description}</p>
                </div>
              </div>
            </div>
          ) : null}

          {projectDeploymentId ? (
            <div className="workspace-shell__deployment-id">
              <GitBranchIcon />
              <div>
                <span>Deployment ID</span>
                <strong>{projectDeploymentId}</strong>
              </div>
            </div>
          ) : null}

        </div>

        <section className="workspace-shell__projects">
          <div className="workspace-shell__projects-header">
            <div>
              <p className="workspace-shell__eyebrow">Your projects</p>
              <h2>All deployments</h2>
            </div>
            <span>{projects.length} project{projects.length === 1 ? "" : "s"}</span>
          </div>

          {projects.length ? (
            <div className="project-grid">
              {projects.map((project) => (
                <ProjectCard key={project.projectDeploymentId} project={project} />
              ))}
            </div>
          ) : (
            <div className="workspace-shell__empty-state">
              <p>No projects yet. Publish your first repository to see it here.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
