import { SiteHeader } from "../components/site-header";
import { WorkspaceShell } from "../components/workspace-shell";

export default function AppPage() {
  return (
    <>
      <SiteHeader minimal />
      <WorkspaceShell />
    </>
  );
}
