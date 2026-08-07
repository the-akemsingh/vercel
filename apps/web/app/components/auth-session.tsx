"use client";

import { useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const AUTH_SESSION_EVENT = "launchpad-auth-session-change";

function readSessionFromStorage(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userRaw = localStorage.getItem(AUTH_USER_KEY);

  if (!token || !userRaw) {
    return null;
  }

  try {
    const user = JSON.parse(userRaw) as AuthUser;
    if (!user.id || !user.name || !user.email) {
      return null;
    }
    return { token, user };
  } catch {
    return null;
  }
}

export function persistAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_TOKEN_KEY, session.token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name.trim();
}

export function getAvatarInitial(name: string) {
  return getFirstName(name).slice(0, 1).toUpperCase();
}

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncSession = () => {
      setSession(readSessionFromStorage());
      setReady(true);
    };

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener(AUTH_SESSION_EVENT, syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(AUTH_SESSION_EVENT, syncSession);
    };
  }, []);

  return { ready, session };
}