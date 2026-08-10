import type React from "react";
import { useEffect, useState } from "react";

export interface ToastItem {
  id: number;
  message: string;
  kind: "success" | "error" | "info";
}

type Listener = (item: ToastItem) => void;

let nextId = 0;
const listeners = new Set<Listener>();
const durations: Record<ToastItem["kind"], number> = {
  success: 3500,
  error: 6000,
  info: 3000,
};

export function toast(
  message: string,
  kind: ToastItem["kind"] = "success",
): void {
  const item: ToastItem = { id: ++nextId, message, kind };
  listeners.forEach((l) => l(item));
  window.setTimeout(() => {
    listeners.forEach((l) => l({ ...item, message: "__dismiss__" }));
  }, durations[kind]);
}

export function ToastHost(): React.JSX.Element {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener: Listener = (item) => {
      setItems((prev) => {
        if (item.message === "__dismiss__") {
          return prev.filter((t) => t.id !== item.id);
        }
        return [...prev, item];
      });
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (items.length === 0) return <div data-toast-host />;

  const styles: Record<ToastItem["kind"], string> = {
    success: "bg-green text-white",
    error: "bg-danger text-white",
    info: "bg-ink text-white",
  };
  const icons: Record<ToastItem["kind"], string> = {
    success: "✓",
    error: "✕",
    info: "i",
  };

  return (
    <div
      data-toast-host
      className="fixed right-5 bottom-5 z-[100] flex w-[min(380px,calc(100vw-40px))] flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-soft ${styles[item.kind]}`}
        >
          <span className="grid size-6 flex-none place-items-center rounded-full bg-white/20 text-xs">
            {icons[item.kind]}
          </span>
          <span className="leading-snug">{item.message}</span>
        </div>
      ))}
    </div>
  );
}