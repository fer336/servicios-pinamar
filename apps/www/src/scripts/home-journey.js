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
  const sheet = find('.sheet');
  const handle = find('.sheetHandle');
  const introText = lead.textContent;
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
  // Desktop and portrait phones: one extra scroll step before the first service, in which the hero copy blows apart.
  const desktopIntro = matchMedia('(min-width: 781px) and (min-height: 551px), (max-width: 780px) and (orientation: portrait)');
  const wide = matchMedia('(min-width: 781px)');
  const introSteps = () => (desktopIntro.matches ? 1 : 0);
  const stepSize = () => (journey.offsetHeight - stage.offsetHeight) / (stops.length + 0.6 + introSteps());
  const copy = find('.copy');

  const vec = (el, rand) => {
    const angle = rand() * Math.PI * 2;
    const dist = 38 + rand() * 80;
    el.style.cssText = '--dx:' + (Math.cos(angle) * dist).toFixed(1) + 'vw;--dy:' + (Math.sin(angle) * dist * 0.8 - 10).toFixed(1) + 'vh;--r:' +
      ((rand() - 0.5) * 1440).toFixed(0) + 'deg;--s:' + (0.3 + rand() * 2.2).toFixed(2) + ';--d:' + (rand() * 0.5).toFixed(2);
  };
  // Wrap every letter in a span (words stay together so wrapping is unchanged); the text content is untouched.
  function splitNode(node, rand) {
    if (node.nodeType === 3) {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) return fragment.append(' ');
        const word = document.createElement('span');
        word.className = 'xw';
        for (const char of part) {
          const letter = document.createElement('span');
          letter.className = 'xl';
          letter.textContent = char;
          vec(letter, rand);
          word.append(letter);
        }
        fragment.append(word);
      });
      node.replaceWith(fragment);
    } else if (node.nodeType === 1) {
      Array.from(node.childNodes).forEach((child) => splitNode(child, rand));
    }
  }
  function split(element, seed) {
    if (element.querySelector('.xl')) return;
    let state = seed;
    const rand = () => (state = (state * 16807) % 2147483647) / 2147483647;
    splitNode(element, rand);
  }
  // Collapsed phone sheet shows two lines of the lead: tag the words after them so CSS can hide them
  // without an overflow clip (a clip would also cut the letters while they fly out).
  function markLeadLines() {
    const words = Array.from(lead.querySelectorAll('.xw'));
    if (!words.length) return;
    lead.classList.add('measure');
    const tops = [...new Set(words.map((word) => word.offsetTop))].sort((a, b) => a - b);
    const limit = tops[1] ?? Infinity;
    words.forEach((word) => word.classList.toggle('x3', word.offsetTop > limit));
    lead.classList.remove('measure');
  }
  function prepareExplosion() {
    if (!desktopIntro.matches) return;
    ['.hj-eyebrow', 'h1', '#lead'].forEach((selector, i) => split(find(selector), 11 + i * 13));
    markLeadLines();
    ['.partner-note', '#quote', '.hint'].forEach((selector, i) => {
      const block = find(selector);
      if (block.classList.contains('xb')) return;
      let state = 101 + i * 29;
      vec(block, () => (state = (state * 16807) % 2147483647) / 2147483647);
      block.classList.add('xb');
    });
  }
  function explode(amount) {
    if (amount > 0.02 && sheet.classList.contains('open')) setSheet(false);
    copy.style.setProperty('--t', amount.toFixed(3));
    copy.classList.toggle('gone', amount > 0.35);
  }

  function go(index) {
    window.scrollTo({ top: index < 0 ? journeyTop() : journeyTop() + (index + 1 + introSteps()) * stepSize(), behavior: 'instant' });
    sync();
  }

  function setSheet(open) {
    sheet.classList.toggle('open', open);
    handle.setAttribute('aria-expanded', String(open));
  }

  function expandViewer(from) {
    const viewer = find('#viewer');
    const to = viewer.getBoundingClientRect();
    viewer.style.setProperty('--clip-from', 'inset(' + [from.top - to.top, to.right - from.right, to.bottom - from.bottom, from.left - to.left].map((v) => Math.max(0, v).toFixed(0) + 'px').join(' ') + ' round 18px)');
    stage.classList.remove('opening');
    void stage.offsetWidth;
    stage.classList.add('opening');
    viewer.addEventListener('animationend', () => stage.classList.remove('opening'), { once: true });
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
    const entering = exploring && !wasTour && desktopIntro.matches && !motion.matches;
    const from = entering && wide.matches ? find('#viewer').getBoundingClientRect() : null;
    setSheet(false);
    stage.classList.toggle('tour', exploring);
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
      if (desktopIntro.matches) {
        split(lead, 7);
        markLeadLines();
      }
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
    const q = p - introSteps();
    const index = Math.min(stops.length - 1, Math.round(q) - 1);
    const changed = current !== index;
    if (changed) {
      current = index;
      updatePanel(index);
    }
    explode(index < 0 && introSteps() ? Math.min(1, p / (introSteps() + 0.4)) : 0);
    if (!move) return;
    if (index < 0) {
      const progress = motion.matches ? 0 : Math.min(1, p / (introSteps() + 0.5));
      // The forest island is wider than tall: give narrow (phone) viewers more room.
      const spanBase = host.clientWidth / Math.max(1, host.clientHeight) < 1.3 ? 25 : 24;
      if (changed || progress !== previousProgress) move(camera([0.72 - 0.66 * progress, 0, 2.0, 0.4, 0.49, spanBase - 2 * progress]), -1, !changed || previousProgress === null);
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
      const poster = host.querySelector('.poster');
      if (poster) {
        // Let the first 3D frame paint, then fade the placeholder out instead of cutting to the scene.
        requestAnimationFrame(() => poster.classList.add('fade'));
        setTimeout(() => poster.remove(), 600);
      }
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
  handle.onclick = () => setSheet(!sheet.classList.contains('open'));
  find('#previousService').onclick = () => go(Math.max(-1, current - 1));
  find('#nextService').onclick = () => {
    loadScene();
    go(Math.min(stops.length - 1, current + 1));
  };

  window.addEventListener('scroll', () => {
    loadScene();
    schedule();
  }, { passive: true });
  window.addEventListener('resize', () => {
    markLeadLines();
    schedule();
  });
  motion.addEventListener('change', () => {
    current = null;
    sync();
  });
  desktopIntro.addEventListener('change', () => {
    prepareExplosion();
    current = null;
    sync();
  });
  prepareExplosion();
  sync();

  // Start the 3D engine once the page is idle; do not compete with the first paint.
  const start = () => ('requestIdleCallback' in window ? requestIdleCallback(loadScene, { timeout: 400 }) : setTimeout(loadScene, 300));
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
