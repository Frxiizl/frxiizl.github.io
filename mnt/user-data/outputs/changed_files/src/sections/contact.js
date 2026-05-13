import { createEl } from "../lib/dom.js";
import { contactConfig } from "../config/contact.js";

export function createContactSection({ audio }) {
  const el = createEl("section", { className: "section", "data-section": "contact" });
  const wrap = createEl("div", { className: "section__wrap" });

  const screen = createScreen({ title: "Contact" });

  const rows = contactConfig.links;

  for (const item of rows) {
    const row = createEl("div", { className: "screen__sub", style: "margin-top: 10px;" });
    const text = createEl("span");
    text.append(`${item.label}: `);

    if (item.value) {
      const val = createEl("span", { className: "contact-link" }, item.value);
      text.append(val);
    } else {
      text.append("—");
    }

    const btn = createEl("button", { className: "copy-btn", type: "button" }, "copy");
    btn.addEventListener("click", () => {
      audio?.sfx?.("click");
      if (!item.value) return;
      navigator.clipboard.writeText(item.value).then(() => {
        const orig = btn.textContent;
        btn.textContent = "copied!";
        setTimeout(() => (btn.textContent = orig), 1500);
      });
    });

    row.append(text, btn);
    screen.main.append(row);
  }

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
