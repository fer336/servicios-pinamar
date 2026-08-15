import type React from "react";
import { useState } from "react";
import { startGoogleOAuth } from "../lib/auth";
import { Spinner } from "./Spinner";

export interface LoginGoogleProps {
  error: string | null;
}

export function LoginGoogle({ error }: LoginGoogleProps): React.JSX.Element {
  const [busy, setBusy] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-[26px] bg-paper p-8 shadow-soft">
        <header className="mb-7 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-green text-lg font-bold text-white shadow-card">
            SP
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Panel de administración
          </h1>
          <p className="mt-1 text-sm text-muted">
            Servicios Pinamar · Iniciá sesión con la cuenta autorizada
          </p>
        </header>

        <div className="grid gap-4">
          {error ? (
            <p className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              startGoogleOAuth();
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? <Spinner size={18} /> : null}
            Ingresar con Google
          </button>
        </div>
      </div>
    </div>
  );
}
