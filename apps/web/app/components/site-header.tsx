"use client";

import { BrandMark } from "./brand-mark";
import { ArrowUpRightIcon } from "./icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { clearAuthSession, getFirstName, useAuthSession } from "./auth-session";
import Link from "next/link";

export function SiteHeader() {
  const { ready, session } = useAuthSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    clearAuthSession();
    setIsMenuOpen(false);
    router.replace("/");
  }

  return (
    <header className="site-header">
      <Link href={session ? "/app" : "/"} className="brand" aria-label="Launchpad home">
        <BrandMark />
        <span>launchpad</span>
      </Link>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#workflow">Workflow</a>
        <a href="#features">Features</a>
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        {ready && session ? (
          <div className="header-user">
            <button
              type="button"
              className="header-avatar"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <span>{getFirstName(session.user.name)}</span>
            </button>
            {isMenuOpen ? (
              <div className="header-user__menu" role="menu">
                <p className="header-user__name">{getFirstName(session.user.name)}</p>
                <p className="header-user__email">{session.user.email}</p>
                <button type="button" className="header-user__logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <a className="header-cta" href="#sign-in">
            Start deploying <ArrowUpRightIcon />
          </a>
        )}
      </div>
    </header>
  );
}
