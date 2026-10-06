(() => {
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
    html.aju-cursor-enabled, html.aju-cursor-enabled body,
    html.aju-cursor-enabled a, html.aju-cursor-enabled button,
    html.aju-cursor-enabled [role="button"], html.aju-cursor-enabled summary,
    html.aju-cursor-enabled input, html.aju-cursor-enabled textarea,
    html.aju-cursor-enabled select { cursor: none !important; }
    #aju-cursor-root {
      position: fixed;
      inset: 0;
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
      transition: stroke-width .18s ease, opacity .18s ease;
    }
    #aju-cursor-root.is-hovering .aju-cursor-trail {
      stroke-width: 2.2;
      opacity: .95;
    }
    @media (pointer: coarse), (max-width: 900px) {
      #aju-cursor-root { display: none !important; }
    }
  `;
  document.head.append(style);

  const root = document.createElement('div');
  root.id = 'aju-cursor-root';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = '<svg class="aju-cursor-svg"><path class="aju-cursor-trail" d=""></path></svg>';
  document.body.append(root);
  document.documentElement.classList.add('aju-cursor-enabled');

  const trail = root.querySelector('.aju-cursor-trail');
  const points = [];
  const maxPoints = 15;
  let tx = innerWidth / 2;
  let ty = innerHeight / 2;
  let seenPointer = false;

  const interactiveSelector = 'a,button,[role="button"],summary,input,textarea,select,.featured-card,.idea,.plugin-tool,.project,.tile';

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
    tx = event.clientX;
    ty = event.clientY;
    if (!seenPointer) {
      seenPointer = true;
      root.classList.add('is-visible');
    }
    points.unshift({ x: tx, y: ty });
    if (points.length > maxPoints) points.length = maxPoints;
  }, { passive: true });

  document.addEventListener('pointerover', event => {
    if (event.target.closest?.(interactiveSelector)) root.classList.add('is-hovering');
  });

  document.addEventListener('pointerout', event => {
    const from = event.target.closest?.(interactiveSelector);
    if (!from) return;
    const to = event.relatedTarget?.closest?.(interactiveSelector);
    if (!to) root.classList.remove('is-hovering');
  });

  window.addEventListener('blur', () => root.classList.remove('is-visible'));
  document.addEventListener('mouseleave', () => root.classList.remove('is-visible'));
  document.addEventListener('mouseenter', () => {
    if (seenPointer) root.classList.add('is-visible');
  });

  function frame() {
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
