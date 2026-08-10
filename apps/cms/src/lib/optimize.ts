export interface OptimizedImage {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  bytes: number;
  quality: number;
}

export const FULL_MAX_SIDE = 1920;
export const THUMB_MAX_SIDE = 600;
export const FULL_MAX_BYTES = 300 * 1024;
export const THUMB_MAX_BYTES = 100 * 1024;
export const INITIAL_QUALITY = 0.82;
export const MIN_QUALITY = 0.45;
export const MAX_TRABAJO_IMAGES = 12;

function decodeImageBitmap(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file, { imageOrientation: "from-image" }).catch(
    () => createImageBitmap(file),
  );
}

function scaledDimensions(
  width: number,
  height: number,
  maxSide: number,
): { width: number; height: number } {
  if (width <= maxSide && height <= maxSide) {
    return { width, height };
  }
  const scale = Math.min(maxSide / width, maxSide / height, 1);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function encodeBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("toBlob devolvió null"));
      },
      "image/webp",
      quality,
    );
  });
}

export async function optimizeImage(
  file: File,
  maxSide: number,
  maxBytes: number,
): Promise<OptimizedImage> {
  const bitmap = await decodeImageBitmap(file);
  try {
    const dims = scaledDimensions(bitmap.width, bitmap.height, maxSide);
    const canvas = document.createElement("canvas");
    canvas.width = dims.width;
    canvas.height = dims.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D no disponible");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, dims.width, dims.height);

    let quality = INITIAL_QUALITY;
    let blob = await encodeBlob(canvas, quality);
    let attempts = 0;
    while (blob.size > maxBytes && quality > MIN_QUALITY && attempts < 5) {
      quality = Math.max(MIN_QUALITY, quality - 0.08);
      blob = await encodeBlob(canvas, quality);
      attempts += 1;
    }

    const url = URL.createObjectURL(blob);
    return {
      blob,
      url,
      width: dims.width,
      height: dims.height,
      bytes: blob.size,
      quality,
    };
  } finally {
    bitmap.close();
  }
}

export async function optimizePair(
  file: File,
): Promise<{ full: OptimizedImage; thumb: OptimizedImage }> {
  const [full, thumb] = await Promise.all([
    optimizeImage(file, FULL_MAX_SIDE, FULL_MAX_BYTES),
    optimizeImage(file, THUMB_MAX_SIDE, THUMB_MAX_BYTES),
  ]);
  return { full, thumb };
}

export function validateGalleryFileLimit(
  currentCount: number,
  incomingCount: number,
): string | null {
  if (incomingCount < 1) return "Elegí al menos una imagen.";
  if (currentCount + incomingCount > MAX_TRABAJO_IMAGES) {
    return "Podés cargar hasta 12 imágenes por trabajo.";
  }
  return null;
}

export function moveImageId(
  imageIds: readonly string[],
  imageId: string,
  direction: -1 | 1,
): string[] {
  const currentIndex = imageIds.indexOf(imageId);
  const nextIndex = currentIndex + direction;
  if (
    currentIndex === -1 ||
    nextIndex < 0 ||
    nextIndex >= imageIds.length
  ) {
    return [...imageIds];
  }

  const nextIds = [...imageIds];
  const [item] = nextIds.splice(currentIndex, 1);
  if (item === undefined) return [...imageIds];
  nextIds.splice(nextIndex, 0, item);
  return nextIds;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
