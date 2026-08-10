import type React from "react";
import type { Trabajo } from "../lib/api";
import { SERVICE_TITLES } from "../lib/api";

export interface TrabajoCardProps {
  trabajo: Trabajo;
  onEdit: (trabajo: Trabajo) => void;
  onDelete: (trabajo: Trabajo) => void;
}

export function TrabajoCard({
  trabajo,
  onEdit,
  onDelete,
}: TrabajoCardProps): React.JSX.Element {
  const fecha = new Date(trabajo.createdAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-paper shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div
        className="relative aspect-[4/3] overflow-hidden bg-cream"
        style={
          trabajo.aspectRatio
            ? { aspectRatio: trabajo.aspectRatio.replace(/\s/g, "") }
            : undefined
        }
      >
        {trabajo.thumbnailUrl || trabajo.imageUrl ? (
          <img
            src={trabajo.thumbnailUrl || trabajo.imageUrl}
            alt={trabajo.alt || trabajo.title}
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid size-full place-items-center text-muted">
            Sin imagen
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-green/90 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase backdrop-blur">
          {SERVICE_TITLES[trabajo.service] ?? trabajo.service}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg leading-snug font-semibold text-ink">
          {trabajo.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{trabajo.description}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <time className="text-xs font-medium text-muted">{fecha}</time>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(trabajo)}
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-cream"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDelete(trabajo)}
              className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger hover:text-white"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}