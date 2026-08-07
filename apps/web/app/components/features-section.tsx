"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GitBranchIcon, GlobeIcon, ShieldIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: GitBranchIcon,
    title: "Native Git workflow",
    description: "Push to deploy, with previews automatically built for every branch.",
  },
  {
    icon: GlobeIcon,
    title: "Global from day one",
    description: "Put your application close to every customer without extra configuration.",
  },
  {
    icon: ShieldIcon,
    title: "Safe by default",
    description: "Protected deployments, encrypted credentials, and instant rollback when you need it.",
  },
];

export function FeaturesSection() {
  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) return;

    gsap.from(".features-heading > *", {
      opacity: 0,
      y: 30,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".features-heading",
        start: "top 85%",
      },
    });

    gsap.from(".feature-card", {
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".feature-grid",
        start: "top 80%",
      },
    });
  });

  return (
    <section className="features-section section-wrap" id="features">
      <div className="features-heading">
        <p className="section-eyebrow">Built for momentum</p>
        <h2 className="section-heading">Move from idea to internet, faster.</h2>
      </div>
      <div className="feature-grid">
        {features.map(({ icon: Icon, title, description }) => (
          <div className="feature-card" key={title}>
            <span className="feature-icon-box">
              <Icon />
            </span>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
