"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "./auth-session";

type AuthRedirectProps = {
  whenAuthenticated?: string;
  whenUnauthenticated?: string;
};

export function AuthRedirect({ whenAuthenticated, whenUnauthenticated }: AuthRedirectProps) {
  const router = useRouter();
  const { ready, session } = useAuthSession();

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (session && whenAuthenticated) {
      router.replace(whenAuthenticated);
      return;
    }

    if (!session && whenUnauthenticated) {
      router.replace(whenUnauthenticated);
    }
  }, [ready, router, session, whenAuthenticated, whenUnauthenticated]);

  return null;
}