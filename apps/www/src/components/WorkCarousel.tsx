import * as React from 'react';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { getTrabajos, normalizeServiceFilter, type ServiceSlug, type TrabajoImage, type TrabajoItem } from '../data/trabajos/api';

export const DRAG_BUFFER = 0;
export const VELOCITY_THRESHOLD = 500;
export const GAP = 18;
export const SPRING_OPTIONS = { stiffness: 300, damping: 30 } as const;

const BASE_WIDTH = 260;
const SERVICE_LABEL = {
  gas: 'Gas',
  plomeria: 'Plomería',
  pintura: 'Pintura',
  hidrolavado: 'Hidrolavado'
} as const;
const INITIAL_VISIBLE_BY_MEDIA = {
  MOBILE: 5,
  TABLET: 6,
  DESKTOP: 9
} as const;

interface WorkCarouselProps {
  initialItems: TrabajoItem[];
  initialHasMore?: boolean;
  service?: string;
  loop?: boolean;
  round?: boolean;
}

interface DragInfo {
  offset: { x: number };
  velocity: { x: number };
}

const getInitialVisible = () => {
  if (typeof window === 'undefined') return INITIAL_VISIBLE_BY_MEDIA.DESKTOP;
  if (window.matchMedia('(max-width: 760px)').matches) return INITIAL_VISIBLE_BY_MEDIA.MOBILE;
  if (window.matchMedia('(max-width: 1050px)').matches) return INITIAL_VISIBLE_BY_MEDIA.TABLET;
  return INITIAL_VISIBLE_BY_MEDIA.DESKTOP;
};

const orderedImages = (work: TrabajoItem | undefined): TrabajoImage[] =>
  work ? [...work.images].sort((a, b) => a.sortOrder - b.sortOrder) : [];

const imageDimensions = (ratio: string) => {
  const [rawWidth, rawHeight] = (ratio || '2 / 3').split('/').map((part) => Number(part.trim()));
  const width = rawWidth > 0 ? rawWidth : 2;
  const height = rawHeight > 0 ? rawHeight : 3;
  return { width: 900, height: Math.max(1, Math.round((900 * height) / width)) };
};

const getBrowserService = (fallback: string | undefined): ServiceSlug | undefined => {
  if (typeof window === 'undefined') return normalizeServiceFilter(fallback);
  return normalizeServiceFilter(new URLSearchParams(window.location.search).get('service'));
};

const syncTabsCurrent = (currentService: ServiceSlug | undefined) => {
  if (typeof document === 'undefined') return;
  document.querySelectorAll<HTMLAnchorElement>('.works-tabs a').forEach((link) => {
    const linkService = normalizeServiceFilter(new URL(link.href).searchParams.get('service'));
    if (linkService === currentService) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
};

export default function WorkCarousel({
  initialItems,
  initialHasMore = false,
  service,
  loop = true,
  round = false
}: WorkCarouselProps) {
  const [items, setItems] = useState(initialItems);
  const [visibleCount, setVisibleCount] = useState(Math.min(initialItems.length, getInitialVisible()));
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeService, setActiveService] = useState<ServiceSlug | undefined>(() => getBrowserService(service));
  const [selectedWorkIndex, setSelectedWorkIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedWork = selectedWorkIndex === null ? undefined : items[selectedWorkIndex];
  const images = orderedImages(selectedWork);
  const visibleItems = items.slice(0, visibleCount);
  const canShowMore = visibleCount < items.length || hasMore;

  useEffect(() => {
    let cancelled = false;
    const nextService = getBrowserService(service);
    const initialService = normalizeServiceFilter(service);
    const immediateItems = nextService ? initialItems.filter((item) => item.service === nextService) : initialItems;

    setActiveService(nextService);
    syncTabsCurrent(nextService);
    setItems(immediateItems);
    setVisibleCount(Math.min(immediateItems.length, getInitialVisible()));
    setHasMore(nextService === initialService ? initialHasMore : false);
    setPage(1);
    setIsLoading(false);
    setSelectedWorkIndex(null);
    setActiveImageIndex(0);

    if (nextService === initialService) return () => {
      cancelled = true;
    };

    setIsLoading(true);
    getTrabajos({ page: 1, limit: 12, service: nextService })
      .then((nextPage) => {
        if (cancelled) return;
        setItems(nextPage.items);
        setVisibleCount(Math.min(nextPage.items.length, getInitialVisible()));
        setHasMore(nextPage.hasMore);
        setPage(nextPage.page);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialItems, initialHasMore, service]);

  useEffect(() => {
    document.body.style.overflow = selectedWork ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedWork]);

  const openWork = (index: number) => {
    setSelectedWorkIndex(index);
    setActiveImageIndex(0);
  };

  const closeWork = () => {
    setSelectedWorkIndex(null);
    setActiveImageIndex(0);
  };

  const moveImage = (direction: number) => {
    if (images.length === 0) return;
    const nextIndex = activeImageIndex + direction;
    if (loop) setActiveImageIndex((nextIndex + images.length) % images.length);
    else setActiveImageIndex(Math.min(images.length - 1, Math.max(0, nextIndex)));
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: DragInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) moveImage(1);
    else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) moveImage(-1);
  };

  const showMore = async () => {
    if (isLoading || !canShowMore) return;
    if (visibleCount < items.length) {
      setVisibleCount(items.length);
      return;
    }

    setIsLoading(true);
    try {
      const nextPage = await getTrabajos({ page: page + 1, limit: 12, service: activeService });
      setItems((current) => [...current, ...nextPage.items]);
      setVisibleCount((current) => current + nextPage.items.length);
      setHasMore(nextPage.hasMore);
      setPage(nextPage.page);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="work-grid">
        {visibleItems.map((item, index) => {
          const cover = item.images.find((image) => image.isCover) ?? item.images[0];
          const dimensions = imageDimensions(item.aspectRatio);
          const imageCount = item.images.length;
          return (
            <button
              key={item.id}
              type="button"
              className="work-grid__item"
              data-animate
              style={{ '--item-ar': item.aspectRatio } as CSSProperties}
              aria-label={`Ver galería: ${item.title}`}
              onClick={() => openWork(index)}
            >
              <span className="work-grid__media" aria-hidden="true">
                <img
                  src={cover.thumbnailUrl || cover.imageUrl}
                  alt={cover.alt}
                  width={dimensions.width}
                  height={dimensions.height}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="work-grid__content">
                <span className="work-grid__meta">
                  <span>{SERVICE_LABEL[item.service]}</span>
                  <span>{imageCount} {imageCount === 1 ? 'imagen' : 'imágenes'}</span>
                </span>
                <span className="work-grid__name">{item.title}</span>
                {item.description && <span className="work-grid__description">{item.description}</span>}
                <span className="work-grid__action">Ver trabajo <span aria-hidden="true">→</span></span>
              </span>
            </button>
          );
        })}
      </div>

      {canShowMore && (
        <button type="button" className="button button-outline work-grid__more" disabled={isLoading} onClick={showMore}>
          {isLoading ? 'Cargando trabajos' : 'Ver más trabajos'}
        </button>
      )}

      {selectedWork && (
        <div className="work-carousel-modal is-open" role="dialog" aria-modal="true" aria-label={selectedWork.title} onClick={closeWork}>
          <div className="work-carousel-modal__panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="work-carousel-modal__close" aria-label="Cerrar" onClick={closeWork}>×</button>
            <div className="work-carousel-modal__heading">
              <p className="eyebrow">Trabajos realizados</p>
              <h3>{selectedWork.title}</h3>
              {selectedWork.description && <p>{selectedWork.description}</p>}
            </div>

            <div className={`carousel-container${round ? ' carousel-container--round' : ''}`} style={{ perspective: 1000 }}>
              <motion.div
                className="carousel-track"
                animate={{ x: -(activeImageIndex * (BASE_WIDTH + GAP)) - BASE_WIDTH / 2 }}
                transition={{ type: 'spring', ...SPRING_OPTIONS }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={handleDragEnd}
              >
                {images.map((image, index) => {
                  const distance = index - activeImageIndex;
                  const dimensions = imageDimensions(image.aspectRatio);
                  return (
                    <motion.figure
                      key={image.id}
                      className="carousel-item"
                      animate={{
                        rotateY: distance * -18,
                        scale: index === activeImageIndex ? 1 : 0.86,
                        opacity: Math.abs(distance) > 2 ? 0.35 : 1,
                        zIndex: images.length - Math.abs(distance)
                      }}
                      transition={{ type: 'spring', ...SPRING_OPTIONS }}
                    >
                      <img src={image.imageUrl} alt={image.alt} width={dimensions.width} height={dimensions.height} decoding="async" />
                    </motion.figure>
                  );
                })}
              </motion.div>
            </div>

            {images.length > 1 && (
              <div className="carousel-controls">
                <button type="button" className="carousel-button" aria-label="Imagen anterior" onClick={() => moveImage(-1)}>‹</button>
                <div className="carousel-indicators" aria-label="Imágenes del trabajo">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      className={index === activeImageIndex ? 'is-active' : ''}
                      aria-label={`Ver imagen ${index + 1}`}
                      aria-current={index === activeImageIndex ? 'true' : undefined}
                      onClick={() => setActiveImageIndex(index)}
                    />
                  ))}
                </div>
                <button type="button" className="carousel-button" aria-label="Imagen siguiente" onClick={() => moveImage(1)}>›</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
