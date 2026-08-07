"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckIcon, GitBranchIcon, GlobeIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger);

export function DeploymentPreview() {
  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) return;

    gsap.from(".section-intro > *", {
      opacity: 0,
      y: 30,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".workflow-section",
        start: "top 80%",
      },
    });

    gsap.from(".deploy-window", {
      opacity: 0,
      y: 50,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".deploy-window",
        start: "top 85%",
      },
    });

    // Animate the deploy line drawing
    gsap.from(".deploy-line .line", {
      scaleY: 0,
      transformOrigin: "top center",
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".deploy-line",
        start: "top 85%",
      },
    });
  });

  return (
    <section className="workflow-section section-wrap" id="workflow">
      <div className="section-intro">
        <div>
          <p className="section-eyebrow">A clear path to production</p>
          <h2 className="section-heading">Every push, perfectly orchestrated.</h2>
        </div>
        <p className="section-description">
          Launchpad turns a commit into a secure, shareable deployment — without
          adding another process to your day.
        </p>
      </div>
      <div className="deploy-window">
        <div className="window-bar">
          <span />
          <span />
          <span />
          <p>deployments / storefront</p>
        </div>
        <div className="window-content">
          <div className="commit-row">
            <span className="icon-shell"><GitBranchIcon /></span>
            <div>
              <strong>main</strong>
              <p>feat: refine checkout experience</p>
            </div>
            <span className="commit-hash">8f3a91c</span>
          </div>
          <div className="deploy-line">
            <span className="line-node line-node--start" />
            <span className="line" />
            <span className="line-node line-node--end"><CheckIcon /></span>
          </div>
          <div className="deploy-result">
            <span className="icon-shell icon-shell--success"><GlobeIcon /></span>
            <div>
              <p>Production deployment</p>
              <a href="#sign-in">storefront.launchpad.app</a>
            </div>
            <span className="live-badge"><i />Live</span>
          </div>
        </div>
      </div>
    </section>
  );
}
