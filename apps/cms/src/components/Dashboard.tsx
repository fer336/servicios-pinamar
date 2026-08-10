import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  addTrabajoImages,
  deleteTrabajo,
  deleteTrabajoImage,
  fetchTrabajos,
  reorderTrabajoImages,
  SERVICE_SLUGS,
  SERVICE_TITLES,
  setTrabajoCover,
  type ServiceSlug,
  type Trabajo,
  type TrabajoImage,
  type TrabajosPage,
} from "../lib/api";
import type { TrabajoInput } from "../lib/api";
import { replaceTrabajoImage, updateTrabajo } from "../lib/api";
import {
  moveImageId,
  optimizePair,
  validateGalleryFileLimit,
} from "../lib/optimize";
import { formatError } from "../lib/auth";
import { ConfirmDialog } from "./ConfirmDialog";
import { Pagination } from "./Pagination";
import { Spinner, FullSpinner } from "./Spinner";
import { toast } from "./Toast";
import { TrabajoCard } from "./TrabajoCard";
import { UploadModal, ASPECT_PRESETS } from "./UploadModal";

type Tab = "all" | ServiceSlug;

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "gas", label: "Gas" },
  { key: "plomeria", label: "Plomería" },
  { key: "pintura", label: "Pintura" },
  { key: "hidrolavado", label: "Hidrolavado" },
];

const LIMIT = 12;

export interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps): React.JSX.Element {
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TrabajosPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState<Trabajo | null>(null);
  const [deleting, setDeleting] = useState<Trabajo | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const requestId = useRef(0);

  const reload = useCallback(async (tabValue: Tab, pageValue: number) => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTrabajos({
        page: pageValue,
        limit: LIMIT,
        service: tabValue === "all" ? "" : tabValue,
      });
      if (requestId.current !== id) return;
      setData(result);
      if (result.items.length === 0 && result.page > 1) {
        setPage(Math.max(1, result.page - 1));
      }
    } catch (err) {
      if (requestId.current !== id) return;
      setError(formatError(err));
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload(tab, page);
  }, [tab, page, reload]);

  const handleTab = (next: Tab) => {
    setTab(next);
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!deleting || deletingBusy) return;
    setDeletingBusy(true);
    try {
      await deleteTrabajo(deleting.id);
      toast("Trabajo eliminado", "success");
      setDeleting(null);
      void reload(tab, page);
    } catch (err) {
      toast(`No se pudo eliminar: ${formatError(err)}`, "error");
      setDeletingBusy(false);
    }
  };

  const handleUploaded = () => {
    setShowUpload(false);
    void reload(tab, 1);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-4 px-5">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-green text-sm font-bold text-white">
              SP
            </div>
            <div className="leading-tight">
              <p className="font-display text-sm font-bold tracking-wide text-ink">
                SERVICIOS PINAMAR
              </p>
              <p className="text-[11px] font-medium text-muted">
                Panel de administración
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-green px-5 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
            >
              + Subir trabajo
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="h-10 rounded-xl border border-line px-4 text-sm font-semibold text-muted transition hover:bg-cream hover:text-ink"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-5 py-10">
        <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
              Trabajos realizados
            </h1>
            <p className="mt-1 text-sm text-muted">
              {data ? `${data.total} trabajo${data.total === 1 ? "" : "s"} publicados` : "Cargando…"}
            </p>
          </div>
        </section>

        <nav
          className="mb-8 flex flex-wrap gap-2"
          aria-label="Filtrar por servicio"
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTab(key)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                tab === key
                  ? "bg-green text-white shadow-card"
                  : "border border-line bg-paper text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {loading && !data ? <FullSpinner /> : null}

        {error ? (
          <div className="rounded-3xl border border-danger/25 bg-danger-soft p-8 text-center">
            <p className="font-semibold text-danger">{error}</p>
            <button
              type="button"
              onClick={() => void reload(tab, page)}
              className="mt-4 rounded-xl bg-danger px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Reintentar
            </button>
          </div>
        ) : null}

        {data && data.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((trabajo) => (
                <TrabajoCard
                  key={trabajo.id}
                  trabajo={trabajo}
                  onEdit={setEditing}
                  onDelete={setDeleting}
                />
              ))}
            </div>
            {data.total > LIMIT ? (
              <Pagination
                page={page}
                total={data.total}
                limit={LIMIT}
                onPage={setPage}
              />
            ) : null}
          </>
        ) : null}

        {data && data.items.length === 0 && !loading ? (
          <div className="rounded-3xl border border-dashed border-line bg-paper/60 p-14 text-center">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-cream text-2xl">
              🖼️
            </div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Todavía no hay trabajos
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
              Subí la primera foto del servicio para que aparezca en la página pública.
            </p>
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-green px-6 text-sm font-semibold text-white shadow-soft hover:opacity-90"
            >
              + Subir trabajo
            </button>
          </div>
        ) : null}
      </main>

      {showUpload ? (
        <UploadModal onClose={() => setShowUpload(false)} onCreated={handleUploaded} />
      ) : null}
      {editing ? (
        <EditModal
          trabajo={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void reload(tab, page);
          }}
        />
      ) : null}
      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar trabajo"
        message={
          deleting
            ? `¿Seguro que querés eliminar “${deleting.title}”? Esta acción no se puede deshacer.`
            : ""
        }
        busy={deletingBusy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

interface EditModalProps {
  trabajo: Trabajo;
  onClose: () => void;
  onSaved: () => void;
}

function normalizeGallery(trabajo: Trabajo): TrabajoImage[] {
  if (trabajo.images.length > 0) {
    return normalizeImageList(trabajo.images);
  }

  return [
    {
      id: trabajo.id,
      imageUrl: trabajo.imageUrl,
      thumbnailUrl: trabajo.thumbnailUrl,
      alt: trabajo.alt,
      aspectRatio: trabajo.aspectRatio,
      sortOrder: 0,
      isCover: true,
      createdAt: trabajo.createdAt,
    },
  ];
}

function normalizeImageList(images: readonly TrabajoImage[]): TrabajoImage[] {
  const ordered = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  if (ordered.some((image) => image.isCover)) return ordered;
  return ordered.map((image, index) => ({ ...image, isCover: index === 0 }));
}

function EditModal({
  trabajo,
  onClose,
  onSaved,
}: EditModalProps): React.JSX.Element {
  const [title, setTitle] = useState(trabajo.title);
  const [description, setDescription] = useState(trabajo.description);
  const [alt, setAlt] = useState(trabajo.alt);
  const [service, setService] = useState<TrabajoInput["service"]>(trabajo.service);
  const [aspectRatio, setAspectRatio] = useState(
    trabajo.aspectRatio || ASPECT_PRESETS[0],
  );
  const [orden, setOrden] = useState(String(trabajo.sortOrder ?? ""));
  const [gallery, setGallery] = useState<TrabajoImage[]>(() =>
    normalizeGallery(trabajo),
  );
  const [busy, setBusy] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const applyGalleryUpdate = (updated: Trabajo): void => {
    const nextGallery = normalizeGallery(updated);
    setGallery(nextGallery);
    setAlt(updated.alt);
    setAspectRatio(updated.aspectRatio || ASPECT_PRESETS[0]);
  };

  const runGalleryAction = async (
    action: () => Promise<Trabajo | void>,
    successMessage: string,
  ): Promise<void> => {
    if (galleryBusy) return;
    setGalleryBusy(true);
    setGalleryError(null);
    setProgress(0);
    try {
      const updated = await action();
      if (updated) applyGalleryUpdate(updated);
      toast(successMessage, "success");
    } catch (err) {
      setGalleryError("No se pudo actualizar");
      toast(`No se pudo actualizar: ${formatError(err)}`, "error");
    } finally {
      setGalleryBusy(false);
    }
  };

  const handleMoveImage = (imageId: string, direction: -1 | 1): void => {
    const nextIds = moveImageId(
      gallery.map((image) => image.id),
      imageId,
      direction,
    );
    void runGalleryAction(
      () => reorderTrabajoImages(trabajo.id, nextIds),
      "Orden actualizado",
    );
  };

  const handleAddImages = async (files: FileList | null): Promise<void> => {
    if (!files) return;
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    const limitError = validateGalleryFileLimit(gallery.length, imageFiles.length);
    if (limitError) {
      toast(limitError, "error");
      return;
    }
    await runGalleryAction(async () => {
      const optimized = await Promise.all(
        imageFiles.map(async (file) => (await optimizePair(file)).full.blob),
      );
      return addTrabajoImages(
        trabajo.id,
        { images: optimized },
        { alt: alt.trim() || title.trim(), aspectRatio },
        setProgress,
      );
    }, "Imágenes agregadas");
  };

  const handleReplaceImage = async (
    imageId: string,
    files: FileList | null,
  ): Promise<void> => {
    const file = files?.[0];
    if (!file) return;
    await runGalleryAction(async () => {
      const { full } = await optimizePair(file);
      return replaceTrabajoImage(
        trabajo.id,
        imageId,
        { images: [full.blob] },
        { alt: alt.trim() || title.trim(), aspectRatio },
        setProgress,
      );
    }, "Imagen reemplazada");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setProgress(0);
    const patch: Partial<TrabajoInput> = {
      title: title.trim(),
      description: description.trim(),
      alt: alt.trim() || title.trim(),
      service,
      aspectRatio,
      orden: orden.trim() === "" ? undefined : Number(orden),
    };
    try {
      await updateTrabajo(trabajo.id, patch);
      toast("Trabajo actualizado", "success");
      onSaved();
    } catch (err) {
      toast(`No se pudo actualizar: ${formatError(err)}`, "error");
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Editar trabajo"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl rounded-[26px] bg-paper shadow-soft"
      >
        <header className="flex items-center justify-between border-b border-line px-7 py-5">
          <h3 className="font-display text-xl font-semibold text-ink">
            Editar trabajo
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="grid size-9 place-items-center rounded-full border border-line text-muted transition hover:bg-cream disabled:opacity-40"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        <div className="grid gap-4 p-7">
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Título *
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-line px-3.5 py-2.5 font-normal outline-none focus:border-green"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Descripción
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none rounded-xl border border-line px-3.5 py-2.5 font-normal outline-none focus:border-green"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-semibold text-ink">
              Servicio
              <select
                value={service}
                onChange={(e) =>
                  setService(e.target.value as TrabajoInput["service"])
                }
                className="rounded-xl border border-line px-3.5 py-2.5 font-normal outline-none focus:border-green"
              >
                <option value="">—</option>
                {SERVICE_SLUGS.map((slug) => (
                  <option key={slug} value={slug}>
                    {SERVICE_TITLES[slug]}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-ink">
              Relación de aspecto
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="rounded-xl border border-line px-3.5 py-2.5 font-normal outline-none focus:border-green"
              >
                {ASPECT_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Texto alternativo (alt)
            <input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="rounded-xl border border-line px-3.5 py-2.5 font-normal outline-none focus:border-green"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Orden (opcional)
            <input
              type="number"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="rounded-xl border border-line px-3.5 py-2.5 font-normal outline-none focus:border-green"
            />
          </label>

          <section className="grid gap-3 rounded-2xl border border-line bg-cream/35 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-display text-base font-semibold text-ink">
                  Galería
                </h4>
                <p className="text-xs text-muted">
                  La primera imagen subida fue la portada inicial. Podés ordenar, marcar portada, quitar, reemplazar o agregar imágenes.
                </p>
              </div>
              <label className="cursor-pointer rounded-xl bg-green px-4 py-2 text-xs font-semibold text-white shadow-card transition hover:opacity-90 aria-disabled:pointer-events-none aria-disabled:opacity-50">
                Agregar imágenes
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  disabled={galleryBusy}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    void handleAddImages(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {galleryBusy ? (
              <p className="flex items-center gap-2 text-sm text-muted">
                <Spinner size={16} /> Cargando galería
                {progress > 0 ? ` · ${progress}%` : ""}
              </p>
            ) : null}
            {galleryError ? (
              <p className="rounded-xl bg-danger-soft px-3 py-2 text-sm font-semibold text-danger">
                {galleryError}
              </p>
            ) : null}

            <div className="grid gap-3">
              {gallery.map((image, index) => (
                <div
                  key={image.id}
                  className="grid gap-3 rounded-2xl border border-line bg-paper p-3 sm:grid-cols-[72px_1fr]"
                >
                  <img
                    src={image.thumbnailUrl || image.imageUrl}
                    alt={image.alt || title}
                    className="size-[72px] rounded-xl object-cover"
                  />
                  <div className="grid gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          Imagen {index + 1}{image.isCover ? " · Portada" : ""}
                        </p>
                        <p className="text-xs text-muted">
                          {image.aspectRatio} · Orden {image.sortOrder}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={galleryBusy || index === 0}
                          onClick={() => handleMoveImage(image.id, -1)}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-cream disabled:opacity-40"
                        >
                          Subir
                        </button>
                        <button
                          type="button"
                          disabled={galleryBusy || index === gallery.length - 1}
                          onClick={() => handleMoveImage(image.id, 1)}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-cream disabled:opacity-40"
                        >
                          Bajar
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={galleryBusy || image.isCover}
                        onClick={() =>
                          void runGalleryAction(
                            () => setTrabajoCover(trabajo.id, image.id),
                            "Portada actualizada",
                          )
                        }
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-cream disabled:opacity-40"
                      >
                        Marcar portada
                      </button>
                      <label className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-cream">
                        Reemplazar
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={galleryBusy}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            void handleReplaceImage(image.id, e.target.files);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        disabled={galleryBusy || gallery.length <= 1}
                        onClick={() =>
                          void runGalleryAction(async () => {
                            await deleteTrabajoImage(trabajo.id, image.id);
                            setGallery((prev) =>
                              normalizeImageList(
                                prev
                                .filter((item) => item.id !== image.id)
                                .map((item, nextIndex) => ({
                                  ...item,
                                  sortOrder: nextIndex,
                                })),
                              )
                            );
                          }, "Imagen quitada")
                        }
                        className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger hover:text-white disabled:opacity-40"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {busy ? (
            <div className="rounded-2xl border border-line bg-cream/50 p-4">
              <div className="mb-2 flex justify-between text-xs font-semibold text-muted">
                <span>Guardando…</span>
                {progress > 0 ? <span>{progress}%</span> : null}
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-green transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-cream disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-green px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:opacity-90 disabled:opacity-60"
            >
              {busy ? <Spinner size={16} /> : null}
              Guardar cambios
            </button>
          </div>
        </div>
        </form>
      </div>
  );
}
