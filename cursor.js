(() => {
  function enhanceMyRideLinks() {
    const receipt = document.querySelector('.idea[data-idea-num="MYRIDE"] .card-detail .receipt');
    if (!receipt) return;

    const liveUrl = 'https://t3zrk.github.io/myride-journal/';
    if (receipt.querySelector(`a[href="${liveUrl}"]`)) return;

    const liveRow = document.createElement('div');
    liveRow.className = 'wide';
    liveRow.innerHTML = `<dt>Live site</dt><dd><a class="repo-link" href="${liveUrl}" target="_blank" rel="noopener noreferrer">Open MYRIDE ↗</a></dd>`;

    const githubLink = receipt.querySelector('a[href="https://github.com/t3zrk/myride-journal"]');
    const githubRow = githubLink?.closest('div.wide');
    if (githubRow) receipt.insertBefore(liveRow, githubRow);
    else receipt.append(liveRow);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceMyRideLinks, { once: true });
  } else {
    enhanceMyRideLinks();
  }

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!finePointer || reducedMotion) {
    const fallback = document.createElement('style');
    fallback.id = 'aju-native-cursor-fallback';
    fallback.textContent = 'html,body{cursor:auto!important}a,button,[role="button"],summary,select{cursor:pointer!important}input,textarea{cursor:text!important}';
    document.head.append(fallback);
    return;
  }

  if (document.getElementById('aju-cursor-root')) return;

  const style = document.createElement('style');
  style.id = 'aju-cursor-styles';
  style.textContent = `
    html.aju-cursor-enabled,
    html.aju-cursor-enabled body,
    html.aju-cursor-enabled *,
    html.aju-cursor-enabled a,
    html.aju-cursor-enabled button,
    html.aju-cursor-enabled [role="button"],
    html.aju-cursor-enabled summary,
    html.aju-cursor-enabled input,
    html.aju-cursor-enabled textarea,
    html.aju-cursor-enabled select {
      cursor: none !important;
    }

    #aju-cursor-root {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 2147483646;
      opacity: 0;
      transition: opacity .18s ease;
    }

    #aju-cursor-root.is-visible { opacity: 1; }

    .aju-cursor-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .aju-cursor-trail {
      fill: none;
      stroke: #111;
      stroke-width: 1.35;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: .62;
      transition: stroke .14s ease, stroke-width .18s ease, opacity .18s ease;
    }

    .aju-cursor-ring {
      position: absolute;
      left: 0;
      top: 0;
      width: 28px;
      height: 28px;
      border: 1.7px solid #ff0000;
      border-radius: 50%;
      transform: translate(-50%,-50%);
      transition:
        border-color .14s ease,
        width .2s cubic-bezier(.2,.8,.2,1),
        height .2s cubic-bezier(.2,.8,.2,1),
        border-radius .2s ease,
        rotate .2s ease,
        background .2s ease;
    }

    .aju-cursor-dot {
      position: absolute;
      left: 0;
      top: 0;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #111;
      transform: translate(-50%,-50%);
      transition: background .14s ease;
    }

    #aju-cursor-root.is-on-dark .aju-cursor-trail { stroke: #fff; }
    #aju-cursor-root.is-on-dark .aju-cursor-ring { border-color: #fff; }
    #aju-cursor-root.is-on-dark .aju-cursor-dot { background: #fff; }

    .aju-cursor-label {
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(20px,18px) rotate(-7deg);
      font: 900 10px/1 Arial,Helvetica,sans-serif;
      letter-spacing: .09em;
      color: #171717;
      background: #f3d34a;
      border: 1.5px solid #171717;
      border-radius: 999px;
      padding: 6px 8px;
      opacity: 0;
      transition: opacity .15s ease, transform .18s ease;
      white-space: nowrap;
      box-shadow: 2px 2px 0 rgba(23,23,23,.28);
    }

    #aju-cursor-root.is-hovering .aju-cursor-trail {
      stroke-width: 2.2;
      opacity: .95;
    }

    #aju-cursor-root.is-hovering .aju-cursor-ring {
      width: 58px;
      height: 58px;
      border-radius: 17px;
      rotate: 8deg;
      background: rgba(255,255,255,.12);
    }

    #aju-cursor-root.is-on-dark.is-hovering .aju-cursor-ring {
      background: rgba(255,255,255,.10);
    }

    #aju-cursor-root.is-hovering .aju-cursor-label {
      opacity: 1;
      transform: translate(25px,23px) rotate(-4deg);
    }

    #aju-cursor-root.is-clicking .aju-cursor-ring {
      width: 42px;
      height: 42px;
      rotate: -7deg;
    }

    @media (pointer: coarse), (max-width: 900px) {
      #aju-cursor-root { display: none !important; }
    }
  `;
  document.head.append(style);

  const root = document.createElement('div');
  root.id = 'aju-cursor-root';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = '<svg class="aju-cursor-svg"><path class="aju-cursor-trail" d=""></path></svg><div class="aju-cursor-ring"></div><div class="aju-cursor-dot"></div><div class="aju-cursor-label">OPEN</div>';
  document.body.append(root);
  document.documentElement.classList.add('aju-cursor-enabled');

  const pageHost = document.body;

  function syncCursorLayer() {
    const openDialogs = [...document.querySelectorAll('dialog[open]')];
    const activeDialog = openDialogs.find(dialog => {
      try { return dialog.matches(':modal'); }
      catch { return true; }
    }) || openDialogs[openDialogs.length - 1];
    const target = activeDialog || pageHost;

    if (root.parentElement !== target) target.append(root);
  }

  const dialogObserver = new MutationObserver(syncCursorLayer);
  dialogObserver.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['open']
  });

  document.addEventListener('close', syncCursorLayer, true);
  document.addEventListener('cancel', () => requestAnimationFrame(syncCursorLayer), true);
  syncCursorLayer();

  const ring = root.querySelector('.aju-cursor-ring');
  const dot = root.querySelector('.aju-cursor-dot');
  const label = root.querySelector('.aju-cursor-label');
  const trail = root.querySelector('.aju-cursor-trail');

  const points = [];
  const maxPoints = 15;
  let tx = innerWidth / 2;
  let ty = innerHeight / 2;
  let rx = tx;
  let ry = ty;
  let seenPointer = false;

  const interactiveSelector = 'a,button,[role="button"],summary,input,textarea,select,.featured-card,.idea,.plugin-tool,.project,.tile';

  function setLabel(el) {
    const custom = el?.getAttribute?.('data-cursor-label');
    if (custom) return custom.toUpperCase();
    if (el?.matches?.('input,textarea,select')) return 'TYPE';
    if (el?.matches?.('button,[role="button"],summary')) return 'CLICK';
    return 'OPEN';
  }

  function rgbFromColor(color) {
    const match = color?.match?.(/rgba?\(([^)]+)\)/i);
    if (!match) return null;
    const values = match[1].split(',').map(value => Number.parseFloat(value.trim()));
    if (values.length < 3 || values.some((value, index) => index < 3 && Number.isNaN(value))) return null;
    return {
      r: values[0],
      g: values[1],
      b: values[2],
      a: Number.isFinite(values[3]) ? values[3] : 1
    };
  }

  function backgroundIsDark(x, y) {
    let el = document.elementFromPoint(x, y);

    while (el && el !== document.documentElement) {
      const color = rgbFromColor(getComputedStyle(el).backgroundColor);
      if (color && color.a > .08) {
        const luminance = .2126 * color.r + .7152 * color.g + .0722 * color.b;
        return luminance < 128;
      }
      el = el.parentElement;
    }

    const bodyColor = rgbFromColor(getComputedStyle(document.body).backgroundColor);
    if (bodyColor && bodyColor.a > .08) {
      const luminance = .2126 * bodyColor.r + .7152 * bodyColor.g + .0722 * bodyColor.b;
      return luminance < 128;
    }

    return false;
  }

  function updateContrast() {
    root.classList.toggle('is-on-dark', backgroundIsDark(tx, ty));
  }

  function smoothPath(history) {
    if (history.length < 2) return '';
    const pts = [...history].reverse();
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;

    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      const my = (pts[i].y + pts[i + 1].y) / 2;
      d += ` Q ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }

    const last = pts[pts.length - 1];
    d += ` T ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
    return d;
  }

  window.addEventListener('pointermove', event => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;

    syncCursorLayer();
    tx = event.clientX;
    ty = event.clientY;
    updateContrast();
    root.classList.add('is-visible');

    if (!seenPointer) {
      rx = tx;
      ry = ty;
      seenPointer = true;
    }

    points.unshift({ x: tx, y: ty });
    if (points.length > maxPoints) points.length = maxPoints;
  }, { passive: true });

  document.addEventListener('pointerover', event => {
    const el = event.target.closest?.(interactiveSelector);
    if (!el) return;

    root.classList.add('is-hovering');
    label.textContent = setLabel(el);
  });

  document.addEventListener('pointerout', event => {
    const from = event.target.closest?.(interactiveSelector);
    if (!from) return;

    const to = event.relatedTarget?.closest?.(interactiveSelector);
    if (to) {
      label.textContent = setLabel(to);
      return;
    }

    root.classList.remove('is-hovering');
  });

  document.addEventListener('pointerdown', () => root.classList.add('is-clicking'));
  document.addEventListener('pointerup', () => root.classList.remove('is-clicking'));
  window.addEventListener('blur', () => root.classList.remove('is-visible'));
  document.addEventListener('mouseleave', () => root.classList.remove('is-visible'));
  document.addEventListener('mouseenter', () => {
    if (seenPointer) root.classList.add('is-visible');
  });

  function frame() {
    rx += (tx - rx) * .22;
    ry += (ty - ry) * .22;

    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    dot.style.left = `${tx}px`;
    dot.style.top = `${ty}px`;
    label.style.left = `${tx}px`;
    label.style.top = `${ty}px`;

    trail.setAttribute('d', smoothPath(points));

    if (points.length) {
      for (let i = points.length - 1; i > 0; i--) {
        points[i].x += (points[i - 1].x - points[i].x) * .18;
        points[i].y += (points[i - 1].y - points[i].y) * .18;
      }

      points[0].x += (tx - points[0].x) * .55;
      points[0].y += (ty - points[0].y) * .55;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();