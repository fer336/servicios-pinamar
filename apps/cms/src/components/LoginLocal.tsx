import type React from "react";
import { useState } from "react";
import type { FormEvent } from "react";
import { formatError, loginLocal } from "../lib/auth";
import { Spinner } from "./Spinner";

export interface LoginLocalProps {
  onSuccess: () => void;
}

export function LoginLocal({ onSuccess }: LoginLocalProps): React.JSX.Element {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await loginLocal(username.trim(), password);
      onSuccess();
    } catch (err) {
      setError(formatError(err));
      setBusy(false);
    }
  };

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
            Servicios Pinamar · Iniciá sesión para continuar
          </p>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Usuario
            <input
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl border border-line bg-paper px-3.5 py-2.5 font-normal outline-none transition focus:border-green"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Contraseña
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-line bg-paper px-3.5 py-2.5 font-normal outline-none transition focus:border-green"
            />
          </label>

          {error ? (
            <p className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? <Spinner size={18} /> : null}
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}