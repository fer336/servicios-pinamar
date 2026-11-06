// Home journey client logic. Adapted from the design package's app.js:
// - stops/texts come from the server-rendered markup (src/data/home-journey.ts) instead of a hard-coded array;
// - the chooser entries are real links, so the section works as plain HTML before (or without) JavaScript;
// - three.js, crew.js and scene.js are fetched lazily, after the page has loaded, so they never block first paint.
const root = document.querySelector('.hj');

if (root) {
  const stops = JSON.parse(root.dataset.stops || '[]');
  const scripts = JSON.parse(root.dataset.scripts || '[]');
  const find = (selector) => root.querySelector(selector);
  const journey = find('.journey');
  const stage = find('.stage');
  const host = find('#visual');
  const choices = find('#choices');
  const quote = find('#quote');
  const lead = find('#lead');
  const serviceLink = find('#serviceLink');
  const intro = lead.textContent;
  const defaultQuote = quote.href;
  const defaultQuoteLabel = quote.textContent;
  const whatsappBase = defaultQuote.split('?')[0];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let move = null;
  let current = null;
  let previousProgress = null;
  let queued = false;
  let loading = false;

  const camera = ([angle, targetX, targetY, targetZ, lift, span]) => ({ angle, targetX, targetY, targetZ, lift, span });
  const journeyTop = () => journey.getBoundingClientRect().top + window.scrollY;
  const stepSize = () => (journey.offsetHeight - stage.offsetHeight) / (stops.length + 0.6);

  function go(index) {
    window.scrollTo({ top: index < 0 ? journeyTop() : journeyTop() + (index + 1) * stepSize(), behavior: 'instant' });
    sync();
  }

  function updatePanel(index) {
    const exploring = index >= 0;
    stage.classList.toggle('tour', exploring);
    find('#chapterName').hidden = !exploring;
    find('#reset').hidden = !exploring;
    Array.from(choices.children).forEach((link, i) => link.setAttribute('aria-current', String(i === index)));
    find('#previousService').disabled = index < 0;
    find('#nextService').disabled = index === stops.length - 1;
    if (exploring) {
      const button = choices.children[index];
      choices.scrollTo({
        left: choices.scrollLeft + button.getBoundingClientRect().left - choices.getBoundingClientRect().left - (choices.clientWidth - button.offsetWidth) / 2,
        behavior: motion.matches ? 'instant' : 'smooth'
      });
    } else {
      choices.scrollTo({ left: 0, behavior: 'instant' });
      find('.viewLabel').textContent = 'Vista general';
      lead.textContent = intro;
      quote.href = defaultQuote;
      quote.textContent = defaultQuoteLabel;
      find('#progress').textContent = 'Explorar por servicio';
      return;
    }
    const stop = stops[index];
    find('.viewLabel').textContent = stop.place;
    find('#chapterName').textContent = stop.service;
    lead.textContent = stop.description;
    find('#progress').textContent = String(index + 1).padStart(2, '0') + ' / ' + String(stops.length).padStart(2, '0');
    serviceLink.href = stop.href;
    serviceLink.textContent = 'Más sobre ' + stop.service.toLowerCase() + ' →';
    quote.textContent = 'Consultar por ' + stop.service.toLowerCase() + ' ↗';
    quote.href = whatsappBase + '?text=' + encodeURIComponent('Hola, quiero pedir un presupuesto de ' + stop.service.toLowerCase() + ' para mi propiedad.');
  }

  function sync() {
    queued = false;
    const p = Math.max(0, (window.scrollY - journeyTop()) / Math.max(1, stepSize()));
    const index = Math.min(stops.length - 1, Math.round(p) - 1);
    const changed = current !== index;
    if (changed) {
      current = index;
      updatePanel(index);
    }
    if (!move) return;
    if (index < 0) {
      const progress = motion.matches ? 0 : Math.min(1, p * 2);
      if (changed || progress !== previousProgress) move(camera([0.72 - 0.66 * progress, 0, 2.1, 0, 0.49, 21 - 2 * progress]), -1, !changed || previousProgress === null);
      previousProgress = progress;
    } else if (changed) {
      move(camera(stops[index].camera), index, motion.matches);
    }
  }

  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(sync);
    }
  }

  const loadScript = (src) => new Promise((resolve, reject) => {
    const tag = document.createElement('script');
    tag.src = src;
    tag.onload = resolve;
    tag.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.append(tag);
  });

  async function loadScene() {
    if (loading || move) return;
    loading = true;
    try {
      // Order matters: three.js, then the crew, then the house viewer (classic scripts sharing globals).
      for (const src of scripts) await loadScript(src);
      move = window.buildHouseViewer(host);
      find('#reset').onclick = () => go(-1);
      find('#replay').onclick = () => move.replay();
      host.querySelector('.poster')?.remove();
      current = null;
      previousProgress = null;
      sync();
    } catch {
      // Keep the static poster and the plain links if the 3D engine cannot start.
      loading = false;
    }
  }

  Array.from(choices.children).forEach((link, index) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      loadScene();
      go(index);
    });
  });
  find('#reset').onclick = () => go(-1);
  find('#previousService').onclick = () => go(Math.max(-1, current - 1));
  find('#nextService').onclick = () => {
    loadScene();
    go(Math.min(stops.length - 1, current + 1));
  };

  // "Ver en 3D" on the service cards lives outside this section.
  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('[data-scene-mode]') : null;
    if (!link) return;
    const index = stops.findIndex((stop) => stop.id === link.getAttribute('data-scene-mode'));
    if (index < 0) return;
    event.preventDefault();
    loadScene();
    go(index);
  });

  window.addEventListener('scroll', () => {
    loadScene();
    schedule();
  }, { passive: true });
  window.addEventListener('resize', schedule);
  motion.addEventListener('change', () => {
    current = null;
    sync();
  });
  sync();

  // Start the 3D engine once the page is idle; do not compete with the first paint.
  const start = () => ('requestIdleCallback' in window ? requestIdleCallback(loadScene, { timeout: 2500 }) : setTimeout(loadScene, 1200));
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
