import type React from "react";
export interface SpinnerProps {
  size?: number;
  label?: string;
}

export function Spinner({ size = 22, label }: SpinnerProps): React.JSX.Element {
  return (
    <span className="inline-flex items-center gap-2.5 text-muted">
      <span
        className="inline-block animate-spin rounded-full border-2 border-green/25 border-t-green"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </span>
  );
}

export function FullSpinner({ label }: { label?: string }): React.JSX.Element {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Spinner size={34} label={label ?? "Cargando…"} />
    </div>
  );
}