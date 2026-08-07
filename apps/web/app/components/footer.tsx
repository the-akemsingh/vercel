"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandMark } from "./brand-mark";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) return;

    gsap.from(".site-footer > *", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".site-footer",
        start: "top 90%",
      },
    });
  });

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <a href="#top" className="footer-brand" aria-label="Back to top">
          <BrandMark />
          <span>launchpad</span>
        </a>
        <p className="footer-copy">© 2026 Launchpad — Build boldly. Deploy quietly.</p>
      </div>
    </footer>
  );
}
