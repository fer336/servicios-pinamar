import { useRef, useState } from "react";
import type React from "react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import type { Trabajo, TrabajoInput } from "../lib/api";
import { SERVICE_SLUGS, SERVICE_TITLES, uploadTrabajo } from "../lib/api";
import {
  formatBytes,
  MAX_TRABAJO_IMAGES,
  optimizePair,
  validateGalleryFileLimit,
  type OptimizedImage,
} from "../lib/optimize";
import { formatError } from "../lib/auth";
import { Spinner } from "./Spinner";
import { toast } from "./Toast";

export const ASPECT_PRESETS = ["16 / 9", "4 / 3", "3 / 2", "1 / 1"] as const;

interface PendingItem {
  key: string;
  name: string;
  state: "processing" | "ready" | "error";
  full?: OptimizedImage;
  thumb?: OptimizedImage;
  error?: string;
}

export interface UploadModalProps {
  onClose: () => void;
  onCreated: (trabajo: Trabajo) => void;
}

export function UploadModal({
  onClose,
  onCreated,
}: UploadModalProps): React.JSX.Element {
  const [step, setStep] = useState<"images" | "meta">("images");
  const [items, setItems] = useState<PendingItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alt, setAlt] = useState("");
  const [service, setService] = useState<TrabajoInput["service"]>("");
  const [aspectRatio, setAspectRatio] = useState<string>(ASPECT_PRESETS[0]);
  const [orden, setOrden] = useState("");

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const readyCount = items.filter((i) => i.state === "ready").length;
  const canContinue = readyCount > 0 && !processing;

  const processFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    const limitError = validateGalleryFileLimit(items.length, files.length);
    if (limitError) {
      toast(files.length === 0 ? "Elegí archivos de imagen (JPG, PNG, WebP…)." : limitError, "error");
      return;
    }
    setProcessing(true);
    setDragOver(false);
    const fresh: PendingItem[] = [];
    for (const file of files) {
      const key = crypto.randomUUID();
      const item: PendingItem = {
        key,
        name: file.name,
        state: "processing",
      };
      fresh.push(item);
      setItems((prev) => [...prev, item]);
      try {
        const { full, thumb } = await optimizePair(file);
        setItems((prev) =>
          prev.map((it) =>
            it.key === key
              ? { ...it, state: "ready", full, thumb }
              : it,
          ),
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((it) =>
            it.key === key
              ? { ...it, state: "error", error: formatError(err) }
              : it,
          ),
        );
      }
    }
    setProcessing(false);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    void handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (files: FileList | File[]) => {
    void processFiles(files);
  };

  const removeItem = (key: string) => {
    setItems((prev) => {
      prev
        .filter((it) => it.key === key)
        .forEach((it) => {
          if (it.full) URL.revokeObjectURL(it.full.url);
          if (it.thumb) URL.revokeObjectURL(it.thumb.url);
        });
      return prev.filter((it) => it.key !== key);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (uploading || readyCount === 0) return;
    const ready = items.filter((it) => it.state === "ready");
    const limitError = validateGalleryFileLimit(0, ready.length);
    if (limitError) {
      toast(limitError, "error");
      return;
    }
    if (!service) {
      toast("Seleccioná un servicio", "error");
      return;
    }

    setUploading(true);
    setProgress(0);
    const input: TrabajoInput = {
      title: title.trim(),
      description: description.trim(),
      alt: alt.trim() || title.trim(),
      service,
      aspectRatio,
      orden: orden.trim() === "" ? undefined : Number(orden),
    };

    try {
      const created = await uploadTrabajo(
        input,
        { images: ready.map((item) => item.full!.blob) },
        setProgress,
      );
      onCreated(created);
      toast("Trabajo subido correctamente", "success");
      onClose();
    } catch (err) {
      toast(`No se pudo subir el trabajo: ${formatError(err)}`, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Subir trabajo"
      onClick={(e) => {
        if (e.target === e.currentTarget && !uploading) onClose();
      }}
    >
      <div className="w-full max-w-3xl rounded-[26px] bg-paper shadow-soft">
        <header className="flex items-center justify-between border-b border-line px-7 py-5">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink">
              Subir trabajo
            </h3>
            <p className="text-xs text-muted">
              {step === "images" ? "Paso 1 de 2 · Imágenes" : "Paso 2 de 2 · Datos"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="grid size-9 place-items-center rounded-full border border-line text-muted transition hover:bg-cream disabled:opacity-40"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        {step === "images" ? (
          <div className="grid gap-5 p-7">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`grid place-items-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
                dragOver
                  ? "border-green bg-cream"
                  : "border-line bg-cream/50"
              }`}
            >
              <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-green text-xl text-white shadow-card">
                ↑
              </div>
              <p className="font-display text-base font-semibold text-ink">
                Arrastrá las imágenes acá
              </p>
              <p className="mt-1 mb-4 text-sm text-muted">
                JPG, PNG o WebP · hasta {MAX_TRABAJO_IMAGES} imágenes · la primera queda como portada
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files) void handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={processing}
                onClick={() => inputRef.current?.click()}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-green px-6 font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-60"
              >
                Elegir imágenes
              </button>
            </div>

            {processing ? (
              <p className="flex items-center gap-2 text-sm text-muted">
                <Spinner size={18} /> Procesando y optimizando imágenes…
              </p>
            ) : null}

            {items.length > 0 ? (
              <div className="grid gap-3">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center gap-4 rounded-2xl border border-line bg-cream/40 p-3"
                  >
                    {item.state === "ready" && item.full && item.thumb ? (
                      <div className="flex flex-1 gap-3">
                        <img
                          src={item.thumb.url}
                          alt={item.name}
                          className="size-16 flex-none rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted">
                            Principal: {item.full.width}×{item.full.height} ·{" "}
                            {formatBytes(item.full.bytes)}
                          </p>
                          <p className="text-xs text-muted">
                            Miniatura: {item.thumb.width}×{item.thumb.height} ·{" "}
                            {formatBytes(item.thumb.bytes)}
                          </p>
                        </div>
                        <div className="hidden gap-3 sm:flex">
                          <img
                            src={item.full.url}
                            alt={`Principal ${item.name}`}
                            className="h-16 flex-none rounded-xl object-cover"
                          />
                        </div>
                      </div>
                    ) : null}
                    {item.state === "processing" ? (
                      <p className="flex flex-1 items-center gap-2 text-sm text-muted">
                        <Spinner size={16} /> Procesando…
                      </p>
                    ) : null}
                    {item.state === "error" ? (
                      <p className="flex-1 text-sm font-medium text-danger">
                        {item.error ?? "No se pudo procesar"}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="grid size-8 flex-none place-items-center rounded-full text-muted transition hover:bg-danger-soft hover:text-danger"
                      aria-label={`Quitar ${item.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-cream"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => setStep("meta")}
                className="rounded-xl bg-green px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
              >
                Continuar →
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5 p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-semibold text-ink">
                Título *
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl border border-line bg-paper px-3.5 py-2.5 font-normal outline-none focus:border-green"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-ink">
                Servicio *
                <select
                  required
                  value={service}
                  onChange={(e) =>
                    setService(e.target.value as TrabajoInput["service"])
                  }
                  className="rounded-xl border border-line bg-paper px-3.5 py-2.5 font-normal outline-none focus:border-green"
                >
                  <option value="">Seleccionar servicio</option>
                  {SERVICE_SLUGS.map((slug) => (
                    <option key={slug} value={slug}>
                      {SERVICE_TITLES[slug]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-ink sm:col-span-2">
                Descripción
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none rounded-xl border border-line bg-paper px-3.5 py-2.5 font-normal outline-none transition focus:border-green"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-ink sm:col-span-2">
                Texto alternativo (alt)
                <input
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Descripción breve de la imagen para accesibilidad"
                  className="rounded-xl border border-line bg-paper px-3.5 py-2.5 font-normal outline-none transition focus:border-green"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-ink">
                Relación de aspecto
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="rounded-xl border border-line bg-paper px-3.5 py-2.5 font-normal outline-none focus:border-green"
                >
                  {ASPECT_PRESETS.map((preset) => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-ink">
                Orden (opcional)
                <input
                  type="number"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  placeholder="Menor = primera"
                  className="rounded-xl border border-line bg-paper px-3.5 py-2.5 font-normal outline-none transition focus:border-green"
                />
              </label>
            </div>

            {uploading ? (
              <div className="rounded-2xl border border-line bg-cream/50 p-4">
                <div className="mb-2 flex justify-between text-xs font-semibold text-muted">
                  <span>Subiendo {readyCount} imagen{readyCount === 1 ? "" : "es"}…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-green transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            <div className="flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep("images")}
                disabled={uploading}
                className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-cream disabled:opacity-40"
              >
                ← Imágenes
              </button>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted">
                  {readyCount} lista{readyCount === 1 ? "" : "s"}
                </span>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-green px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-60"
                >
                  {uploading ? <Spinner size={16} /> : null}
                  {uploading ? "Subiendo…" : "Subir trabajo"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
