import { createEl } from "../lib/dom.js";

export function createNav({ getActive, onNavigate, onHover }) {
  const el = createEl("nav", { className: "navbar", "aria-label": "Primary" });
  const list = createEl("div", { className: "navbar__inner" });

  const items = [
    { route: "home", label: "HOME" },
    { route: "projects", label: "PROJECTS" },
    { route: "contact", label: "CONTACT" },
    { route: "donate", label: "DONATE" },
  ];

  const btns = items.map((it, idx) => {
    const b = createEl("button", {
      className: "link-wrapper",
      type: "button",
      "data-route-btn": it.route,
      "data-idx": String(idx),
      "aria-current": "false",
    });

    const fallback = createEl("span", { className: "fallback" }, it.label);
    const imgWrap = createEl("span", { className: "img-wrapper", "aria-hidden": "true" });
    const normal = createEl("span", { className: "img normal" }, it.label);
    const active = createEl("span", { className: "img active" }, it.label);
    imgWrap.append(normal, active);

    const shapes = createEl("span", { className: "shape-wrapper", "aria-hidden": "true" });
    const red = createEl("span", { className: "shape red-fill jelly" });
    const cyan = createEl("span", { className: "shape cyan-fill jelly" });
    const pts = pointsForIdx(idx);
    red.innerHTML = polygonSvg("#FF0000", pts.redPoints);
    cyan.innerHTML = polygonSvg("#00FFFF", pts.cyanPoints);
    shapes.append(red, cyan);

    b.append(fallback, imgWrap, shapes);

    b.addEventListener("pointerenter", () => onHover?.(), { passive: true });
    b.addEventListener("click", () => onNavigate?.(it.route));
    return b;
  });

  list.append(...btns);
  el.append(list);

  function sync() {
    const active = getActive?.();
    for (const b of btns) {
      const isActive = b.getAttribute("data-route-btn") === active;
      b.toggleAttribute("data-active", isActive);
      b.setAttribute("aria-current", isActive ? "page" : "false");
    }
  }

  sync();
  window.addEventListener("focus", sync, { passive: true });

  return { el, sync };
}

function polygonSvg(color, points) {
  return `<svg viewBox="0 0 108.1 47" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <polygon fill="${color}" points="${points}" />
  </svg>`;
}

function pointsForIdx(idx) {
  const sets = [
    {
      redPoints: "29.5,8.5 150.7,0 108.1,32.7 3.1,47",
      cyanPoints: "0.3,17 125.1,0 68.8,45.6 24.3,39",
    },
    {
      redPoints: "0,7.1 127.3,0 32.3,64 4.8,58.2",
      cyanPoints: "14,0.5 127.4,0 77.4,164 2.3,61.1",
    },
    {
      redPoints: "15.5,0 70.7,0 118.1,32.7 43.1,47",
      cyanPoints: "17.3,0 105.1,0 68.8,45.6 24.3,39",
    },
    {
      redPoints: "19.5,0 110.7,0 80.1,32.7 3.1,47",
      cyanPoints: "11,3 85.1,0 118.8,45.6 14.3,29",
    },
  ];
  return sets[idx % sets.length];
}

