// Home journey client logic. Adapted from the design package's app.js:
// - stops/texts come from the server-rendered markup (src/data/home-journey.ts) instead of a hard-coded array;
// - the chooser entries are real links, so the section works as plain HTML before (or without) JavaScript;
// - three.js, crew.js and scene.js are fetched lazily, after the page has loaded, so they never block first paint;
// - page scroll no longer drives the camera: the tour opens on demand, as a full-screen layer.
const root = document.querySelector('.hj');

if (root) {
  const stops = JSON.parse(root.dataset.stops || '[]');
  const scripts = JSON.parse(root.dataset.scripts || '[]');
  const find = (selector) => root.querySelector(selector);
  const stage = find('.stage');
  const host = find('#visual');
  const choices = find('#choices');
  const quote = find('#quote');
  const lead = find('#lead');
  const serviceLink = find('#serviceLink');
  const sheet = find('.sheet');
  const handle = find('.sheetHandle');
  const introText = lead.textContent;
  const defaultQuote = quote.href;
  const defaultQuoteLabel = quote.textContent;
  const whatsappBase = defaultQuote.split('?')[0];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let move = null;
  let current = null;
  let loading = false;

  const camera = ([angle, targetX, targetY, targetZ, lift, span], tour = 0) => ({ angle, targetX, targetY, targetZ, lift, span, tour });
  // The island with its trees is wider than tall: give narrow (phone) viewers more room.
  const overviewView = () => [0.72, 0, 2.0, 0.4, 0.49, host.clientWidth / Math.max(1, host.clientHeight) < 1.3 ? 16 : 19.5];
  const wide = matchMedia('(min-width: 781px)');

  function setSheet(open) {
    sheet.classList.toggle('open', open);
    handle.setAttribute('aria-expanded', String(open));
  }

  function expandViewer(from) {
    const viewer = find('#viewer');
    const to = viewer.getBoundingClientRect();
    // FLIP: start from the card's rectangle and animate to full screen by scaling the whole viewer (canvas included),
    // so the picture grows instead of being cropped.
    viewer.style.transformOrigin = '0 0';
    viewer.animate(
      [
        { transform: 'translate(' + (from.left - to.left) + 'px,' + (from.top - to.top) + 'px) scale(' + from.width / to.width + ',' + from.height / to.height + ')', borderRadius: '18px' },
        { transform: 'none', borderRadius: '0px' }
      ],
      { duration: 900, easing: 'cubic-bezier(.22,.8,.2,1)' }
    );
    stage.classList.remove('opening');
    void stage.offsetWidth;
    stage.classList.add('opening');
    setTimeout(() => stage.classList.remove('opening'), 1100);
  }

  function riseSheet() {
    stage.classList.remove('rising');
    void stage.offsetWidth;
    stage.classList.add('rising');
    setTimeout(() => stage.classList.remove('rising'), 800);
  }

  function updatePanel(index) {
    const exploring = index >= 0;
    const wasTour = stage.classList.contains('tour');
    const entering = exploring && !wasTour && !motion.matches;
    const from = entering && wide.matches ? find('#viewer').getBoundingClientRect() : null;
    setSheet(false);
    stage.classList.toggle('tour', exploring);
    // The tour is a full-screen layer: the page behind it does not scroll while it is open.
    document.documentElement.classList.toggle('hj-touring', exploring);
    if (from) expandViewer(from);
    else if (entering) riseSheet();
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
      lead.textContent = introText;
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

  // Page scroll never drives the journey: the tour opens only when the visitor taps the house (or a service) and is
  // navigated with the dock, the arrows, the wheel or the keyboard.
  function go(index) {
    const next = Math.max(-1, Math.min(stops.length - 1, index));
    const changed = current !== next;
    current = next;
    if (changed) updatePanel(next);
    if (!move) return;
    if (next < 0) move(camera(overviewView()), -1, motion.matches);
    else if (changed) move(camera(stops[next].camera, 1), next, motion.matches);
  }
  const open = (index = 0) => {
    loadScene();
    go(index);
  };

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
      const poster = host.querySelector('.poster');
      if (poster) {
        // Let the first 3D frame paint, then fade the placeholder out instead of cutting to the scene.
        requestAnimationFrame(() => poster.classList.add('fade'));
        setTimeout(() => poster.remove(), 600);
      }
      const shown = current;
      current = null;
      go(shown ?? -1);
    } catch {
      // Keep the static poster and the plain links if the 3D engine cannot start.
      loading = false;
    }
  }

  Array.from(choices.children).forEach((link, index) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      open(index);
    });
  });
  // Tapping the house (not a control on top of it) opens the tour at the first service.
  host.addEventListener('click', () => {
    if (current === null || current < 0) open(0);
  });
  find('#enterTour').onclick = () => open(0);
  find('#reset').onclick = () => go(-1);
  handle.onclick = () => setSheet(!sheet.classList.contains('open'));
  find('#previousService').onclick = () => go(current - 1);
  find('#nextService').onclick = () => open((current ?? -1) + 1);
  document.addEventListener('keydown', (event) => {
    if (current === null || current < 0) return;
    if (event.key === 'Escape') go(-1);
    else if (event.key === 'ArrowRight') go(current + 1);
    else if (event.key === 'ArrowLeft' && current > 0) go(current - 1);
  });
  // Inside the tour the wheel (or trackpad) steps between services, one notch at a time.
  let wheelLock = 0;
  stage.addEventListener('wheel', (event) => {
    if (current === null || current < 0) return;
    event.preventDefault();
    const now = performance.now();
    if (now < wheelLock || Math.abs(event.deltaY) < 12) return;
    wheelLock = now + 650;
    go(current + (event.deltaY > 0 ? 1 : -1 * (current > 0 ? 1 : 0)));
  }, { passive: false });
  go(-1);

  // Start the 3D engine once the page is idle; do not compete with the first paint.
  const start = () => ('requestIdleCallback' in window ? requestIdleCallback(loadScene, { timeout: 400 }) : setTimeout(loadScene, 300));
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
