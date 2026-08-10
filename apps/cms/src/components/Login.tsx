import type React from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { formatError } from "../lib/auth";
import { Spinner } from "./Spinner";

export function Login(): React.JSX.Element {
  const { signIn, isLoaded } = useSignIn();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!signIn || busy) return;
    setBusy(true);
    setError(null);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.href,
        redirectUrlComplete: window.location.href,
      });
    } catch (err) {
      setError(formatError(err));
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-[26px] bg-paper p-8 text-center shadow-soft">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-green text-lg font-bold text-white shadow-card">
          SP
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Panel de administración
        </h1>
        <p className="mt-1 mb-6 text-sm text-muted">
          Servicios Pinamar · Ingresá con tu cuenta de Google
        </p>

        <button
          type="button"
          onClick={handleSignIn}
          disabled={!isLoaded || busy}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-60"
        >
          {busy ? <Spinner size={18} /> : (
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
          )}
          {busy ? "Redirigiendo…" : "Ingresar con Google"}
        </button>

        {error ? (
          <p className="mt-4 rounded-xl bg-danger-soft px-3.5 py-2.5 text-left text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}

        {!isLoaded ? (
          <p className="mt-4 text-xs text-muted">Cargando autenticación…</p>
        ) : null}
      </div>
    </div>
  );
}