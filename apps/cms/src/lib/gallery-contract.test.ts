import {
  MAX_TRABAJO_IMAGES,
  moveImageId,
  validateGalleryFileLimit,
} from "./optimize.ts";
import type { Trabajo, TrabajoImage, UploadFiles } from "./api";

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`);
  }
}

function assertArrayEqual(
  actual: readonly string[],
  expected: readonly string[],
  message: string,
): void {
  assertEqual(actual.join(","), expected.join(","), message);
}

const coverImage: TrabajoImage = {
  id: "img-1",
  imageUrl: "/full.webp",
  thumbnailUrl: "/thumb.webp",
  alt: "Trabajo terminado",
  aspectRatio: "4 / 3",
  sortOrder: 0,
  isCover: true,
  createdAt: "2026-08-09T00:00:00Z",
};

const trabajoWithGallery: Trabajo = {
  id: "trabajo-1",
  title: "Trabajo con galería",
  description: "Una galería preservada al cambiar servicio",
  thumbnailUrl: coverImage.thumbnailUrl,
  imageUrl: coverImage.imageUrl,
  alt: coverImage.alt,
  aspectRatio: coverImage.aspectRatio,
  service: "gas",
  sortOrder: 0,
  createdAt: coverImage.createdAt,
  images: [coverImage],
};

const repeatedFiles: UploadFiles = {
  images: [new Blob(["one"]), new Blob(["two"])],
};

assertEqual(trabajoWithGallery.images[0]?.isCover, true, "first CMS gallery image is cover-capable");
assertEqual(repeatedFiles.images.length, 2, "UploadFiles accepts repeated image blobs");
assertEqual(MAX_TRABAJO_IMAGES, 12, "CMS gallery upload cap stays at twelve images");
assertEqual(validateGalleryFileLimit(0, 12), null, "new work can upload twelve images");
assertEqual(
  validateGalleryFileLimit(1, 12),
  "Podés cargar hasta 12 imágenes por trabajo.",
  "existing gallery rejects uploads over the cap before processing",
);
assertArrayEqual(
  moveImageId(["img-1", "img-2", "img-3"], "img-3", -1),
  ["img-1", "img-3", "img-2"],
  "gallery can move image up",
);
assertArrayEqual(
  moveImageId(["img-1", "img-2", "img-3"], "img-1", 1),
  ["img-2", "img-1", "img-3"],
  "gallery can move image down",
);
