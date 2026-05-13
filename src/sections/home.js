import { createEl } from "../lib/dom.js";
import { brand } from "../config/brand.js";

export function createHomeSection({ audio }) {
  const el = createEl("section", { className: "section", "data-section": "home" });
  const wrap = createEl("div", { className: "section__wrap" });

  const screen = createScreen({ title: "Home" });

  const quote = createEl("div", { className: "screen__sub" }, `“${brand.quote}”`);

  screen.main.append(quote);

  wrap.append(screen.el);
  el.append(wrap);

  el.addEventListener(
    "click",
    (e) => {
      const target = e.target?.closest?.("button, a");
      if (target) audio?.sfx?.("click");
    },
    { passive: true },
  );

  return { el };
}

function createScreen({ title }) {
  const el = createEl("div", { className: "screen" });
  const plate = createEl("div", { className: "screen__plate" });
  plate.append(createEl("div", { className: "screen__title" }, title));
  const main = createEl("div", { className: "screen__main" });
  el.append(plate, main);
  return { el, main };
}

function createMenuRow(label, value, { copy }) {
  const el = createEl("div", { className: "menu__item" });
  const k = createEl("div", { className: "menu__k" }, label);
  const v = createEl("div", { className: "menu__v" }, value);
  const btn = copy ? createEl("button", { className: "menu__btn", type: "button" }, "copy") : createEl("div");
  el.append(k, v, btn);
  return { el, value: v, btn };
}

