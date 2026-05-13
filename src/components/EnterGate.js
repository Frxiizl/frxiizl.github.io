import { createEl } from "../lib/dom.js";

export function createEnterGate({ label, subtitle, onEnter, disabled = false }) {
  const el = createEl("div", { className: "enter", role: "dialog", "aria-modal": "true" });
  const scrim = createEl("div", { className: "enter__scrim" });
  const card = createEl("div", { className: "enter__card" });
  const title = createEl("div", { className: "enter__title" }, label);
  const sub = subtitle ? createEl("div", { className: "enter__sub" }, subtitle) : null;

  if (disabled) {
    card.setAttribute("aria-disabled", "true");
  }

  card.append(title);
  if (sub) card.append(sub);
  el.append(scrim, card);

  let entered = false;
  async function enter() {
    if (entered || disabled) return;
    entered = true;
    el.setAttribute("data-leaving", "1");
    try {
      await onEnter?.();
    } finally {
      window.setTimeout(() => el.remove(), 2500);
    }
  }

  el.addEventListener("pointerdown", enter);
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Enter" || e.key === " ") enter();
    },
    { passive: true },
  );

  return { el };
}

