import { createEl } from "../lib/dom.js";

export function createProjectsSection() {
  const el = createEl("section", { className: "section", "data-section": "projects" });
  const wrap = createEl("div", { className: "section__wrap" });

  const screen = createScreen({ title: "About Me" });

  const card = createEl("div", {
    className: "screen__sub",
    style: "margin-top: 16px; padding: 20px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; line-height: 1.7; max-width: 520px; text-align: left;",
  }, "i'm a developer and student who spends most of their time building, breaking, and fixing things until they actually work the way they're supposed to. i like working on systems, scripting, and random side projects that usually start as small ideas and end up way bigger than expected. i care more about getting things done the way they are and understanding how things work rather than flashy stuff. always learning and trying to get better with every project i make.");

  screen.main.append(card);
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
