import type React from "react";
export interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPage: (page: number) => void;
}

export function Pagination({
  page,
  total,
  limit,
  onPage,
}: PaginationProps): React.JSX.Element {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const buttonBase =
    "inline-flex h-10 items-center justify-center gap-1 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-ink transition hover:bg-cream disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-3"
      aria-label="Paginación"
    >
      <button
        type="button"
        className={buttonBase}
        disabled={!canPrev}
        onClick={() => onPage(page - 1)}
      >
        ← Anterior
      </button>
      <span className="text-sm font-medium text-muted">
        Página <strong className="text-ink">{page}</strong> de {totalPages} ·{" "}
        {total} trabajo{total === 1 ? "" : "s"}
      </span>
      <button
        type="button"
        className={buttonBase}
        disabled={!canNext}
        onClick={() => onPage(page + 1)}
      >
        Siguiente →
      </button>
    </nav>
  );
}