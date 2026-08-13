import { trabajosFiles } from './index';

export const SERVICE_SLUG = {
  GAS: 'gas',
  PLOMERIA: 'plomeria',
  PINTURA: 'pintura',
  HIDROLAVADO: 'hidrolavado'
} as const;

export type ServiceSlug = (typeof SERVICE_SLUG)[keyof typeof SERVICE_SLUG];

export const SERVICE_SLUGS = Object.values(SERVICE_SLUG);

export interface TrabajoImage {
  id: string;
  thumbnailUrl: string;
  imageUrl: string;
  alt: string;
  aspectRatio: string;
  sortOrder: number;
  isCover: boolean;
}

export interface TrabajoItem {
  id: string;
  title: string;
  description: string;
  service: ServiceSlug;
  thumbnailUrl: string;
  imageUrl: string;
  alt: string;
  aspectRatio: string;
  images: TrabajoImage[];
}

export interface TrabajosPage {
  items: TrabajoItem[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface GetTrabajosParams {
  page?: number;
  limit?: number;
  service?: string;
}

const TIMEOUT_MS = 2500;

// Base URL of the public API. Resolved in this order:
//   1. PUBLIC_API_BASE_URL env var (PUBLIC_ exposes it to client bundles too,
//      which WorkCarousel needs for client-side "load more" fetches).
//   2. http://localhost:8000 in dev (local FastAPI instance).
//   3. https://cms.serviciospinamar.com in production as last resort (the public
//      API lives under the CMS subdomain).
const API_BASE_URL =
  import.meta.env.PUBLIC_API_BASE_URL ??
  (import.meta.env.DEV ? 'http://localhost:8000' : 'https://cms.serviciospinamar.com');

export const normalizeServiceFilter = (service: string | null | undefined): ServiceSlug | undefined => {
  if (!service) return undefined;
  return SERVICE_SLUGS.find((slug) => slug === service);
};

const fallbackImage = (item: TrabajoItem): TrabajoImage => ({
  id: `${item.id}-cover`,
  thumbnailUrl: item.thumbnailUrl,
  imageUrl: item.imageUrl,
  alt: item.alt,
  aspectRatio: item.aspectRatio,
  sortOrder: 0,
  isCover: true
});

const sortImages = (images: TrabajoImage[]) => [...images].sort((a, b) => a.sortOrder - b.sortOrder);

const normalizeTrabajoItem = (item: TrabajoItem): TrabajoItem => {
  const images = sortImages(item.images?.length ? item.images : [fallbackImage(item)]);
  const cover = images.find((image) => image.isCover) ?? images[0];

  return {
    ...item,
    thumbnailUrl: cover.thumbnailUrl,
    imageUrl: cover.imageUrl,
    alt: item.alt || cover.alt,
    aspectRatio: item.aspectRatio || cover.aspectRatio,
    images
  };
};

const localItems: TrabajoItem[] = Object.values(trabajosFiles).flatMap((file) =>
  file.items.map((item) => normalizeTrabajoItem(item))
);

export const getLocalTrabajosPage = ({ page = 1, limit = 12, service }: GetTrabajosParams): TrabajosPage => {
  const normalizedService = normalizeServiceFilter(service);
  const pool = normalizedService ? localItems.filter((item) => item.service === normalizedService) : localItems;
  const total = pool.length;
  const start = (page - 1) * limit;
  const items = pool.slice(start, start + limit);

  return { items, page, limit, total, hasMore: start + limit < total };
};

export const getTrabajos = async ({ page = 1, limit = 12, service }: GetTrabajosParams): Promise<TrabajosPage> => {
  const normalizedService = normalizeServiceFilter(service);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (normalizedService) query.set('service', normalizedService);

    const res = await fetch(`${API_BASE_URL}/api/trabajos?${query.toString()}`, {
      signal: controller.signal,
      headers: { accept: 'application/json' }
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('api unavailable');

    const data = (await res.json()) as Partial<TrabajosPage>;
    if (!Array.isArray(data.items)) throw new Error('invalid api shape');

    return {
      items: data.items.map((item) => normalizeTrabajoItem(item)),
      page: data.page ?? page,
      limit: data.limit ?? limit,
      total: data.total ?? data.items.length,
      hasMore: data.hasMore ?? false
    };
  } catch {
    return getLocalTrabajosPage({ page, limit, service: normalizedService });
  }
};
