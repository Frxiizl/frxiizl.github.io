import { createEl } from "../lib/dom.js";
import { donateConfig } from "../config/donate.js";
import { toast } from "../components/Toast.js";

export function createDonateSection({ audio }) {
  const el = createEl("section", { className: "section", "data-section": "donate" });
  const wrap = createEl("div", { className: "section__wrap" });

  const screen = createScreen({ title: "Donate" });


  const Currencies = ["BTC", "LTC", "ETH", "USDT", "XRP"];
  for (const sym of Currencies) {
    const addr = donateConfig[sym] || "";
    const row = createEl("div", { className: "screen__sub", style: "margin-top: 10px;" });
    const text = createEl("span", {}, `${sym}: ${addr || "—"}`);

    const btn = createEl("button", { className: "copy-btn", type: "button" }, "copy");
    btn.addEventListener("click", async () => {
      audio?.sfx?.("click");
      if (!addr) return;
      await copy(addr);
      toast("Copied!");
    });

    row.append(text, btn);
    screen.main.append(row);
  }

  const indicator = createEl("div", { className: "screen__scroll-indicator" }, "▼");
  screen.el.append(indicator);

  wrap.append(screen.el);
  el.append(wrap);
  return { el };
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.append(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

function createScreen({ title }) {
  const el = createEl("div", { className: "screen" });
  const plate = createEl("div", { className: "screen__plate" });
  plate.append(createEl("div", { className: "screen__title" }, title));
  const main = createEl("div", { className: "screen__main" });
  el.append(plate, main);
  return { el, main };
}

