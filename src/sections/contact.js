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
      const href = getContactHref(item);
      const link = createEl(
        "a",
        {
          href,
          className: "contact-link",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        item.value,
      );

      if (href.startsWith("mailto:") || href.startsWith("discord://")) {
        link.removeAttribute("target");
        link.removeAttribute("rel");
      }

      link.addEventListener("click", () => audio?.sfx?.("click"), { passive: true });
      text.append(link);
    } else {
      text.append("—");
    }

    const btn = createEl("button", { className: "copy-btn", type: "button" }, "open");
    btn.addEventListener("click", () => {
      audio?.sfx?.("click");
      if (!item.value) return;
      openContactHref(getContactHref(item));
    });

    row.append(text, btn);
    screen.main.append(row);
  }

  wrap.append(screen.el);
  el.append(wrap);

  return { el };
}

function getContactHref(item) {
  const label = String(item.label || "").toLowerCase();

  if (label === "discord") return "discord://-/users/656838514281021451";
  if (label === "email") return `mailto:${item.value}`;
  if (label === "github") return "https://github.com/frxiizl";
  return item.value;
}

function openContactHref(href) {
  if (!href) return;

  if (href.startsWith("http://") || href.startsWith("https://")) {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }

  window.location.href = href;
}

function createScreen({ title }) {
  const el = createEl("div", { className: "screen" });
  const plate = createEl("div", { className: "screen__plate" });
  plate.append(createEl("div", { className: "screen__title" }, title));
  const main = createEl("div", { className: "screen__main" });
  el.append(plate, main);
  return { el, main };
}

