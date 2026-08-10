export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export type ServiceSlug = "gas" | "plomeria" | "pintura" | "hidrolavado";
export const SERVICE_SLUGS: ServiceSlug[] = [
  "gas",
  "plomeria",
  "pintura",
  "hidrolavado",
];

export const SERVICE_TITLES: Record<string, string> = {
  gas: "Gas",
  plomeria: "Plomería",
  pintura: "Pintura",
  hidrolavado: "Hidrolavado",
};

export interface Trabajo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  imageUrl: string;
  alt: string;
  aspectRatio: string;
  service: ServiceSlug;
  sortOrder: number;
  createdAt: string;
  images: TrabajoImage[];
}

export interface TrabajoImage {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  alt: string;
  aspectRatio: string;
  sortOrder: number;
  isCover: boolean;
  createdAt: string;
}

export interface TrabajosPage {
  items: Trabajo[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface TrabajoInput {
  title: string;
  description: string;
  alt: string;
  service: ServiceSlug | "";
  aspectRatio: string;
  orden?: number;
}

export interface UploadFiles {
  images: Blob[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const TOKEN_KEY = "sp_admin_token";
type TokenProvider = () => Promise<string | null>;

let tokenProvider: TokenProvider = () =>
  Promise.resolve(sessionStorage.getItem(TOKEN_KEY));

export function setTokenProvider(provider: TokenProvider): void {
  tokenProvider = provider;
}

export function setStoredToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function hasStoredToken(): boolean {
  return storedToken() !== null;
}

export function isClerkMode(): boolean {
  return Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
}

function storedToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

async function authedHeaders(): Promise<Record<string, string>> {
  const token = await tokenProvider();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = (await res.json()) as { detail?: string; message?: string };
      message = body.detail ?? body.message ?? message;
    } catch {
      // keep default message
    }
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function fetchTrabajos(params: {
  page?: number;
  limit?: number;
  service?: ServiceSlug | "";
}): Promise<TrabajosPage> {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 1));
  search.set("limit", String(params.limit ?? 12));
  if (params.service) search.set("service", params.service);
  const res = await fetch(`${API_BASE_URL}/api/trabajos?${search.toString()}`, {
    headers: await authedHeaders(),
  });
  return handleResponse<TrabajosPage>(res);
}

async function authorizeXhr(xhr: XMLHttpRequest): Promise<void> {
  const header = (await authedHeaders()).Authorization;
  if (header) xhr.setRequestHeader("Authorization", header);
}

function xhrErrorMessage(xhr: XMLHttpRequest): string {
  try {
    const body = JSON.parse(xhr.responseText) as {
      detail?: string;
      error?: string;
    };
    return body.detail ?? body.error ?? `Error ${xhr.status}`;
  } catch {
    return xhr.responseText || `Error ${xhr.status}`;
  }
}

function appendFiles(form: FormData, files: UploadFiles): void {
  files.images.forEach((image) => form.append("files", image));
}

function buildTrabajoForm(input: TrabajoInput, files: UploadFiles): FormData {
  const form = new FormData();
  form.append("title", input.title);
  form.append("description", input.description);
  form.append("alt", input.alt);
  if (input.service) form.append("service", input.service);
  form.append("aspect_ratio", input.aspectRatio);
  if (input.orden !== undefined && input.orden !== null) {
    form.append("orden", String(input.orden));
  }
  appendFiles(form, files);
  return form;
}

export function uploadTrabajo(
  input: TrabajoInput,
  files: UploadFiles,
  onProgress: (percent: number) => void,
): Promise<Trabajo> {
  return new Promise<Trabajo>((resolve, reject) => {
    void (async () => {
      const xhr = new XMLHttpRequest();
      const form = buildTrabajoForm(input, files);

      xhr.open("POST", `${API_BASE_URL}/api/trabajos`);
      try {
        await authorizeXhr(xhr);
      } catch (err) {
        reject(err);
        return;
      }
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText) as Trabajo);
          } catch {
            reject(new ApiError("Respuesta inválida del servidor", xhr.status));
          }
        } else {
          reject(new ApiError(xhrErrorMessage(xhr), xhr.status));
        }
      };
      xhr.onerror = () => reject(new ApiError("Error de red al subir", 0));
      xhr.send(form);
    })();
  });
}

export async function updateTrabajo(
  id: string,
  patch: Partial<TrabajoInput>,
  files?: UploadFiles,
  onProgress?: (percent: number) => void,
): Promise<Trabajo> {
  if (files && files.images.length > 0) {
    await replaceTrabajoImagen(
      id,
      files.images[0],
      patch.alt ?? "",
      onProgress,
    );
  }

  const res = await fetch(`${API_BASE_URL}/api/trabajos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(await authedHeaders()),
    },
    body: JSON.stringify(patch),
  });
  return handleResponse<Trabajo>(res);
}

function uploadXhr(
  method: "POST" | "PUT",
  url: string,
  form: FormData,
  onProgress?: (percent: number) => void,
): Promise<Trabajo> {
  return new Promise<Trabajo>((resolve, reject) => {
    void (async () => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      try {
        await authorizeXhr(xhr);
      } catch (err) {
        reject(err);
        return;
      }
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress?.(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText) as Trabajo);
          } catch {
            reject(new ApiError("Respuesta inválida del servidor", xhr.status));
          }
        } else {
          reject(new ApiError(xhrErrorMessage(xhr), xhr.status));
        }
      };
      xhr.onerror = () =>
        reject(new ApiError("Error de red al actualizar imágenes", 0));
      xhr.send(form);
    })();
  });
}

function buildImagesForm(
  files: UploadFiles,
  meta?: { alt?: string; aspectRatio?: string },
): FormData {
  const form = new FormData();
  appendFiles(form, files);
  if (meta?.alt !== undefined) form.append("alt", meta.alt);
  if (meta?.aspectRatio !== undefined) {
    form.append("aspect_ratio", meta.aspectRatio);
  }
  return form;
}

export function addTrabajoImages(
  id: string,
  files: UploadFiles,
  meta?: { alt?: string; aspectRatio?: string },
  onProgress?: (percent: number) => void,
): Promise<Trabajo> {
  return uploadXhr(
    "POST",
    `${API_BASE_URL}/api/trabajos/${id}/imagenes`,
    buildImagesForm(files, meta),
    onProgress,
  );
}

export async function deleteTrabajoImage(
  id: string,
  imageId: string,
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/trabajos/${id}/imagenes/${imageId}`, {
    method: "DELETE",
    headers: await authedHeaders(),
  });
  return handleResponse<void>(res);
}

export async function reorderTrabajoImages(
  id: string,
  imageIds: string[],
): Promise<Trabajo> {
  const res = await fetch(`${API_BASE_URL}/api/trabajos/${id}/imagenes/reorder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(await authedHeaders()),
    },
    body: JSON.stringify({ imageIds }),
  });
  return handleResponse<Trabajo>(res);
}

export async function setTrabajoCover(
  id: string,
  imageId: string,
): Promise<Trabajo> {
  const res = await fetch(`${API_BASE_URL}/api/trabajos/${id}/imagenes/${imageId}/cover`, {
    method: "PUT",
    headers: await authedHeaders(),
  });
  return handleResponse<Trabajo>(res);
}

export function replaceTrabajoImage(
  id: string,
  imageId: string,
  files: UploadFiles,
  meta?: { alt?: string; aspectRatio?: string },
  onProgress?: (percent: number) => void,
): Promise<Trabajo> {
  return uploadXhr(
    "PUT",
    `${API_BASE_URL}/api/trabajos/${id}/imagenes/${imageId}/imagen`,
    buildImagesForm({ images: files.images.slice(0, 1) }, meta),
    onProgress,
  );
}

export function replaceTrabajoImagen(
  id: string,
  image: Blob,
  alt: string,
  onProgress?: (percent: number) => void,
): Promise<Trabajo> {
  const form = new FormData();
  form.append("files", image);
  form.append("alt", alt);
  return uploadXhr("PUT", `${API_BASE_URL}/api/trabajos/${id}/imagen`, form, onProgress);
}

export async function deleteTrabajo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/trabajos/${id}`, {
    method: "DELETE",
    headers: await authedHeaders(),
  });
  return handleResponse<void>(res);
}
