import { clamp } from "../lib/dom.js";

export function createParallax() {
  let raf = 0;
  let target = null;
  let noise = null;
  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  function attach({ target: t, noise: n }) {
    target = t;
    noise = n;

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onTilt, true);
    tick();
  }

  function onMove(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    mx = clamp(x, -1, 1);
    my = clamp(y, -1, 1);
  }

  function onTilt(e) {
    if (typeof e.gamma !== "number" || typeof e.beta !== "number") return;
    const x = clamp(e.gamma / 35, -1, 1);
    const y = clamp(e.beta / 35, -1, 1);
    mx = x;
    my = y;
  }

  function tick() {
    raf = requestAnimationFrame(tick);
    rx += (mx - rx) * 0.05;
    ry += (my - ry) * 0.05;
    const tX = rx * 18;
    const tY = ry * 14;
    const nX = rx * -10;
    const nY = ry * 10;

    if (target) target.style.transform = `translate3d(${tX}px, ${tY}px, 0) scale(1.06)`;
    if (noise) noise.style.transform = `translate3d(${nX}px, ${nY}px, 0)`;
  }

  function detach() {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("deviceorientation", onTilt, true);
  }

  return { attach, detach };
}

