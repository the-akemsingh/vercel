"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { persistAuthSession, useAuthSession } from "./auth-session";

const uploadServiceUrl = (process.env.NEXT_PUBLIC_UPLOAD_SERVICE_URL ?? "http://localhost:3001/api/v1").replace(/\/$/, "");
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type AuthState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; name: string };

export default function GoogleSignIn() {
  const [authState, setAuthState] = useState<AuthState>({ kind: "idle" });
  const { session } = useAuthSession();
  const router = useRouter();

  async function signIn(credential?: string) {
    if (!credential) {
      setAuthState({ kind: "error", message: "Google did not return a credential." });
      return;
    }

    setAuthState({ kind: "loading" });
    try {
      const response = await fetch(`${uploadServiceUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });
      const payload = (await response.json()) as {
        token?: string;
        message?: string;
        user?: { id:string,email:string,name: string,image:string };
      };

      if (!response.ok || !payload.token) {
        throw new Error(payload.message ?? "Unable to sign in with Google.");
      }

      const user = payload.user;
      if (!user?.id || !user.name || !user.email) {
        throw new Error("Incomplete user details were returned from the sign-in request.");
      }

      persistAuthSession({
        token: payload.token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
        },
      });
      setAuthState({ kind: "success", name: user.name });
      router.replace("/app");
    } catch (error) {
      setAuthState({
        kind: "error",
        message: error instanceof Error ? error.message : "Unable to sign in with Google.",
      });
    }
  }

  if (session) {
    return (
      <div className="auth-connected">
        <p className="auth-connected__label">Signed in as {session.user.name}</p>
        <Link className="auth-connected__button" href="/app">
          Continue to app
        </Link>
      </div>
    );
  }

  if (authState.kind === "success") {
    return <p className="auth-success">Welcome, {authState.name}. You&apos;re signed in.</p>;
  }

  if (!googleClientId) {
    return <p className="auth-message auth-message--config">Missing Google client configuration.</p>;
  }

  return (
    <>
      <GoogleOAuthProvider clientId={googleClientId}>
        <div className={authState.kind === "loading" ? "auth-login is-loading" : "auth-login"}>
          <GoogleLogin
            onSuccess={({ credential }) => signIn(credential)}
            onError={() => setAuthState({ kind: "error", message: "Google sign-in was cancelled or failed." })}
            theme="outline"
            shape="rectangular"
            width="280"
          />
        </div>
      </GoogleOAuthProvider>
      <p aria-live="polite" className="auth-message">
        {authState.kind === "loading" && "Signing you in…"}
      </p>
    </>
  );
}
