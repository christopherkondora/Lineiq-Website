"use client";

import { MouseEvent, ReactNode } from "react";
import Link from "next/link";

interface SplashLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export default function SplashLink({
  href,
  className,
  children,
  onClick,
}: SplashLinkProps) {
  const isAnchor = href.startsWith("#");
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isAnchor) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    onClick?.();
  };

  if (isInternal) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={handleAnchorClick}>
      {children}
    </a>
  );
}
