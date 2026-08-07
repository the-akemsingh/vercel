"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type AnimationOptions = {
  /** Selector for child elements to stagger. If omitted, animates the container itself. */
  staggerSelector?: string;
  /** Stagger delay between items in seconds. */
  stagger?: number;
  /** Y offset to animate from (px). */
  y?: number;
  /** Duration in seconds. */
  duration?: number;
  /** Delay before the animation starts (seconds). */
  delay?: number;
  /** Start position for ScrollTrigger. */
  start?: string;
  /** Auto-play on mount (no scroll trigger). */
  immediate?: boolean;
};

/**
 * useScrollAnimation
 *
 * A reusable hook that animates elements into view on scroll using GSAP
 * + ScrollTrigger. Supports staggered children or single-element reveals.
 *
 * Returns a ref to attach to the container element.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: AnimationOptions = {},
) {
  const {
    staggerSelector,
    stagger = 0.08,
    y = 40,
    duration = 0.8,
    delay = 0,
    start = "top 85%",
    immediate = false,
  } = options;

  const containerRef = useRef<T>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) return;

      const targets = staggerSelector
        ? gsap.utils.toArray<HTMLElement>(staggerSelector)
        : [containerRef.current!];

      if (!targets.length) return;

      const vars: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        stagger: staggerSelector ? stagger : 0,
      };

      if (immediate) {
        gsap.fromTo(targets, { opacity: 0, y }, vars);
      } else {
        gsap.fromTo(targets, {
          opacity: 0,
          y,
        }, {
          ...vars,
          scrollTrigger: {
            trigger: containerRef.current!,
            start,
          },
        });
      }
    },
    { scope: containerRef },
  );

  return containerRef;
}
