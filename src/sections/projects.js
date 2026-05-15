import { createEl } from "../lib/dom.js";

export function createProjectsSection({ redirectUrl }) {
  const el = createEl("section", { className: "section", "data-section": "projects" });
  const wrap = createEl("div", { className: "section__wrap" });

  const screen = createScreen({ title: "Projects" });

  const desc = createEl("div", { className: "screen__sub" }, "");
  const btn = createEl("button", { className: "cta", type: "button", "data-autofocus": "1" }, "");

  btn.addEventListener("click", () => {
    window.open(redirectUrl, "_blank", "noopener,noreferrer");
  });

  screen.main.append(desc, btn);
  wrap.append(screen.el);
  el.append(wrap);
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

