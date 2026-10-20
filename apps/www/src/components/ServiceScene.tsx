import { useCallback, useEffect, useRef, useState } from 'react';
import { sceneModes } from '../data/service-scene';
import type { ServiceSceneHandle } from './service-scene/scene';

type Status = 'loading' | 'ready' | 'failed';

// Interactive 3D house for the home hero. The server-rendered markup (tabs, copy and a
// fallback photo) works without JavaScript; three.js is only fetched once the island hydrates.
export default function ServiceScene() {
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<Status>('loading');
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ServiceSceneHandle | null>(null);
  const activeRef = useRef(0);

  const select = useCallback((index: number) => {
    activeRef.current = index;
    setActive(index);
    sceneRef.current?.setMode(index);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([import('three'), import('./service-scene/scene')])
      .then(([three, { createServiceScene }]) => {
        if (cancelled || !stageRef.current || !canvasRef.current) return;
        sceneRef.current = createServiceScene(three, stageRef.current, canvasRef.current);
        sceneRef.current.setMode(activeRef.current);
        setStatus('ready');
      })
      .catch(() => {
        // No WebGL or the chunk failed to load: keep the fallback photo.
        if (!cancelled) setStatus('failed');
      });
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  // "Ver en 3D" links on the service cards live outside this island.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('[data-scene-mode]') : null;
      if (!link) return;
      const index = sceneModes.findIndex((mode) => mode.id === link.getAttribute('data-scene-mode'));
      if (index >= 0) select(index);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [select]);

  const mode = sceneModes[active];
  const ready = status === 'ready';

  return (
    <div className="scene-card" id="escena">
      <div className="scene-stage" ref={stageRef}>
        <img className="scene-fallback" src={mode.fallbackImage} alt={mode.title} hidden={ready} width="800" height="600" />
        <canvas
          ref={canvasRef}
          className="scene-canvas"
          data-ready={ready}
          role="img"
          aria-label={`Casa en 3D: ${mode.title.toLowerCase()}`}
        />
        {ready && (
          <p className="scene-hint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Arrastrá para girar la casa
          </p>
        )}
      </div>
      <div className="scene-panel">
        <div className="scene-tabs" role="group" aria-label="Elegí un servicio">
          {sceneModes.map((item, index) => (
            <button key={item.id} type="button" className="scene-tab" aria-pressed={index === active} onClick={() => select(index)}>
              <span className="scene-tab__num">{String(index + 1).padStart(2, '0')}</span>
              <span className="scene-tab__label">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="scene-info" aria-live="polite">
          <div>
            <h2>{mode.title}</h2>
            <p>{mode.description}</p>
          </div>
          <a className="scene-link" href={mode.href}>
            Ver el servicio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
