import { qsa } from "../lib/dom.js";

export function createRouter({ initial, onChange } = {}) {
  let route = initial || "home";
  let prev = null;
  const subs = new Set();

  function notify() {
    const payload = { from: prev, to: route };
    onChange?.(payload);
    for (const fn of subs) fn(payload);
    syncDom();
  }

  function syncDom() {
    document.documentElement.setAttribute("data-route", route);
    for (const btn of qsa("[data-route-btn]")) {
      const isActive = btn.getAttribute("data-route-btn") === route;
      btn.setAttribute("aria-current", isActive ? "page" : "false");
      btn.toggleAttribute("data-active", isActive);
    }
  }

  return {
    get: () => route,
    set: (next) => {
      if (!next || next === route) return;
      prev = route;
      route = next;
      notify();
    },
    onChange: (fn) => {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
}

