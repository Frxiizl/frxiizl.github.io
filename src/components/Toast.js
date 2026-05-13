import { createEl } from "../lib/dom.js";

let host = null;

export function toast(msg) {
  if (!host) {
    host = createEl("div", { className: "toasts", role: "status", "aria-live": "polite" });
    document.body.append(host);
  }
  const t = createEl("div", { className: "toast" }, msg);
  host.append(t);
  window.setTimeout(() => t.setAttribute("data-out", "1"), 1400);
  window.setTimeout(() => t.remove(), 1900);
}

