"use client";

import { useEffect, useRef, MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { gsap } from "gsap";

interface SplashLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  cursorText?: string; // kept for API compatibility, ignored
  splashColor?: string; // kept for API compatibility, ignored
  arrow?: boolean;
  onClick?: () => void;
}

export default function SplashLink({
  href,
  className,
  children,
  arrow,
  onClick,
}: SplashLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isPrimary = !!className?.includes("btn-primary");
  const showArrow = arrow ?? isPrimary;

  const isAnchor = href.startsWith("#");
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!isPrimary) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const strength = 0.25;
    const max = 10;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: globalThis.MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      xTo(Math.max(-max, Math.min(max, dx)));
      yTo(Math.max(-max, Math.min(max, dy)));
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [isPrimary]);

  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isAnchor) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    onClick?.();
  };

  const content = (
    <>
      {children}
      {showArrow && (
        <span className="btn-arrow" aria-hidden="true">
          →
        </span>
      )}
    </>
  );

  if (isInternal) {
    return (
      <Link
        ref={ref}
        href={href}
        className={className}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onClick={handleAnchorClick}
    >
      {content}
    </a>
  );
}
