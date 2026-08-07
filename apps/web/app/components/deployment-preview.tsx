import { CheckIcon, GitBranchIcon, GlobeIcon } from "./icons";
import { ScrollReveal } from "./scroll-reveal";

export function DeploymentPreview() {
  return (
    <section className="workflow-section" id="workflow">
      <ScrollReveal className="section-intro">
        <p className="eyebrow"><span />A clear path to production</p>
        <h2>Every push, perfectly orchestrated.</h2>
        <p>Launchpad turns a commit into a secure, shareable deployment—without adding another process to your day.</p>
      </ScrollReveal>
      <ScrollReveal className="deploy-window" delay={100}>
        <div className="window-bar"><span /><span /><span /><p>deployments / storefront</p></div>
        <div className="window-content">
          <div className="commit-row">
            <span className="icon-shell"><GitBranchIcon /></span>
            <div><strong>main</strong><p>feat: refine checkout experience</p></div>
            <span className="commit-hash">8f3a91c</span>
          </div>
          <div className="deploy-line"><span className="line-node line-node--start" /><span className="line" /><span className="line-node line-node--end"><CheckIcon /></span></div>
          <div className="deploy-result">
            <span className="icon-shell icon-shell--success"><GlobeIcon /></span>
            <div><p>Production deployment</p><a href="#sign-in">storefront.launchpad.app</a></div>
            <span className="live-badge"><i />Live</span>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
