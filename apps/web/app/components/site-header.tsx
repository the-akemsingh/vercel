"use client";

import { BrandMark } from "./brand-mark";
import { ThemeToggle } from "./theme-toggle";
import {
  clearAuthSession,
  getAvatarInitial,
  getFirstName,
  useAuthSession,
} from "./auth-session";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, LogOut, ArrowUpRight } from "lucide-react";

type SiteHeaderProps = {
  /** Hide nav links (use on inner pages like /app) */
  minimal?: boolean;
};

export function SiteHeader({ minimal = false }: SiteHeaderProps) {
  const { ready, session } = useAuthSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-avatar")) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [isMenuOpen]);

  function handleLogout() {
    clearAuthSession();
    setIsMenuOpen(false);
    router.replace("/");
  }

  const firstName = session ? getFirstName(session.user.name) : "";
  const avatarInitial = session ? getAvatarInitial(session.user.name) : "";

  return (
    <header className={`landing-nav`}>
      <div className="landing-nav__inner">
        <Link
          href={session ? "/app" : "/"}
          className="landing-nav__brand"
          aria-label="Launchpad home"
        >
          <BrandMark />
          <span>Launchpad</span>
        </Link>

        <div className="landing-nav__actions">
          <ThemeToggle />

          {ready && session ? (
            <div className="user-avatar">
              <button
                type="button"
                className="user-avatar__btn"
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((c) => !c)}
              >
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={firstName}
                    className="user-avatar__img"
                  />
                ) : (
                  <span className="user-avatar__img">{avatarInitial}</span>
                )}
                <span className="user-avatar__name">{firstName}</span>
                <ChevronDown className="user-avatar__chevron" />
              </button>

              {isMenuOpen && (
                <div className="user-avatar__menu" role="menu">
                  <div className="user-avatar__menu-header">
                    <p className="user-avatar__menu-name">{session.user.name}</p>
                    <p className="user-avatar__menu-email">{session.user.email}</p>
                  </div>
                  <div className="user-avatar__menu-body">
                    <button
                      type="button"
                      className="user-avatar__menu-item user-avatar__menu-item--danger"
                      onClick={handleLogout}
                    >
                      <LogOut />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <a className="btn-primary" href="#sign-in">
              Start deploying
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
