"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) return;

    gsap.from(".cta-card > *", {
      opacity: 0,
      y: 30,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".cta-card",
        start: "top 80%",
      },
    });
  });

  return (
    <section className="cta-section section-wrap">
      <div className="cta-card">
        <h2>Ready to ship?</h2>
        <p>
          Connect your repository and get a live deployment URL in minutes. No
          build scripts, no server configuration, no headaches.
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a className="btn-primary" href="#sign-in">
            Start deploying
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a className="btn-secondary" href="#features">
            Explore features
          </a>
        </div>
      </div>
    </section>
  );
}
