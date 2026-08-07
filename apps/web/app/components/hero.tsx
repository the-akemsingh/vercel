"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckIcon } from "./icons";
import GoogleSignIn from "./auth-panel";
import { ChevronRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const proofPoints = [
  "Deploy from any Git repository",
  "Preview every pull request",
  "Roll back in one click",
];

export function Hero() {
  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-badge", { opacity: 0, y: 20, duration: 0.6 })
      .from(
        ".hero-title-line",
        { opacity: 0, y: 30, duration: 0.8, stagger: 0.12 },
        "-=0.3",
      )
      .from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
      .from(
        ".hero-ctas > *",
        { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 },
        "-=0.3",
      )
      .from(
        ".hero-proof > *",
        { opacity: 0, y: 15, duration: 0.4, stagger: 0.08 },
        "-=0.2",
      )
      .from(".hero-terminal", { opacity: 0, y: 40, duration: 0.8 }, "-=0.4")
      .from(
        ".hero-terminal__body > *",
        { opacity: 0, duration: 0.15, stagger: 0.12 },
        "-=0.3",
      );

    // Parallax on the glow
    gsap.to(".hero-glow", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Parallax on the terminal
    gsap.to(".hero-terminal", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  return (
    <section className="hero-section" id="top">
      <div className="hero-glow gsap-fade-in" />
      <div className="hero-glow hero-glow--secondary gsap-fade-in" />

      <div className="hero-content">
        <div className="hero-badge gsap-fade-up">
          <span className="hero-badge__tag">New</span>
          <span>Git-powered deployments, zero config</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line block">Ship what matters.</span>
          <span className="hero-title-line hero-title-accent block">
            We&apos;ll handle the launch.
          </span>
        </h1>

        <p className="hero-subtitle">
          From your first commit to a production URL, Launchpad gives your team
          a calm, reliable path to deploy — no DevOps expertise required.
        </p>

        <div className="hero-ctas">
          <a className="btn-primary" href="#sign-in">
            Start deploying
          </a>
        </div>

        <div className="hero-proof" aria-label="Platform benefits">
          {proofPoints.map((point) => (
            <span key={point}>
              <CheckIcon />
              {point}
            </span>
          ))}
        </div>
      </div>

      {/* Terminal preview window */}
      <div className="hero-terminal">
        <div className="hero-terminal__bar">
          <span className="hero-terminal__dot" />
          <span className="hero-terminal__dot" />
          <span className="hero-terminal__dot" />
          <p className="hero-terminal__title">deployments / storefront</p>
        </div>
        <div className="hero-terminal__body">
          <div>
            <span className="cmd">~</span> git push origin main
          </div>
          <div className="dim">
            <p>→ Launchpad detected push to main</p>
            <p>→ Cloning repository…</p>
            <p>→ Installing dependencies…</p>
            <p>→ Running build steps…</p>
          </div>
          <div>
            <span className="ok">✔</span>{" "}
            <span className="cmd">Build complete.</span>{" "}
            <span className="ok">Deployment live.</span>
          </div>
          <div>
            <span className="cmd">→</span>{" "}
            <a href="#sign-in" style={{ color: "var(--color-accent)" }}>
              storefront.launchpad.app
            </a>{" "}
            <span className="hero-terminal__cursor" />
          </div>
        </div>
      </div>

      {/* Auth card */}
      <aside className="auth-card" id="sign-in" style={{ marginTop: 64, maxWidth: 440 }}>
        <p className="auth-card__kicker">Your next release starts here</p>
        <h2>Deploy an application today.</h2>
        <p>Sign in with Google to connect your project and get a live URL in minutes.</p>
        <GoogleSignIn />
        <small>By continuing, you agree to our Terms and Privacy Policy.</small>
      </aside>
    </section>
  );
}
