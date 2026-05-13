import { createEl } from "../lib/dom.js";
import { createRouter } from "../state/router.js";
import { createAudio } from "../fx/audio.js";
import { createParallax } from "../fx/parallax.js";
import { createVisualizer } from "../fx/visualizer.js";
import { createEnterGate } from "../components/EnterGate.js";
import { createNav } from "../components/Nav.js";
import { createHomeSection } from "../sections/home.js";
import { createProjectsSection } from "../sections/projects.js";
import { createContactSection } from "../sections/contact.js";
import { createDonateSection } from "../sections/donate.js";
import { brand } from "../config/brand.js";

export function mountApp(root) {
  root.textContent = "";
  root.removeAttribute("data-entered");
  const mobileBlocked = isMobileDevice();

  const router = createRouter({
    initial: "home",
    onChange: ({ from, to }) => {
      stage.setAttribute("data-route", to);
      stage.setAttribute("data-from", from ?? "");
      stage.setAttribute("data-nav-transition", "1");
      window.setTimeout(() => stage.removeAttribute("data-nav-transition"), 450);
    },
  });

  const audio = createAudio();
  const visualizer = createVisualizer();

  const shell = createEl("div", { className: "shell" });
  const bg = createEl("div", { className: "bg" });
  const bgImg = createEl("div", { className: "bg__img", role: "presentation" });
  const bgNoise = createEl("div", { className: "bg__noise", role: "presentation" });
  const vizWrap = createEl("div", { className: "bg__viz", role: "presentation" });
  const vizCanvas = createEl("canvas", { className: "viz", width: "900", height: "250" });

  vizWrap.append(vizCanvas);
  bg.append(bgImg, bgNoise, vizWrap);

  const chrome = createEl("div", { className: "chrome" });
  const header = createEl("header", { className: "topbar" });
  const sig = createEl("div", { className: "sig" });
  sig.innerHTML = `<div class="sig__name">${escapeHtml(brand.name)}</div><div class="sig__role">${escapeHtml(brand.role)}</div>`;

  const nav = createNav({
    getActive: () => router.get(),
    onNavigate: (route) => {
      audio.sfx("click");
      if (route === "projects") {
        window.open(brand.projectsRedirect, "_blank", "noopener,noreferrer");
        return;
      }
      router.set(route);
    },
    onHover: () => audio.sfx("hover"),
  });

  header.append(sig, nav.el);
  chrome.append(header);

  const stage = createEl("main", { className: "stage", "data-route": router.get() });
  const sections = {
    home: createHomeSection({ audio }),
    projects: createProjectsSection({ redirectUrl: brand.projectsRedirect }),
    contact: createContactSection({ audio }),
    donate: createDonateSection({ audio }),
  };

  for (const key of Object.keys(sections)) {
    stage.append(sections[key].el);
  }

  shell.append(chrome, stage);
  root.append(bg, shell);

  const enter = createEnterGate({
    label: mobileBlocked ? "" : "enter",
    subtitle: mobileBlocked ? "mobile not supported sorry!" : "",
    disabled: mobileBlocked,
    onEnter: mobileBlocked
      ? undefined
      : async () => {
        root.setAttribute("data-entered", "1");
        await audio.init();
        audio.sfx("enter");
        audio.music("bg");
        visualizer.attach({ audioContext: audio.ctx, source: audio.musicNode });
        visualizer.start(vizCanvas);
        // parallax.attach({ target: bgImg, noise: bgNoise });
      },
  });

  root.append(enter.el);
  router.onChange(({ to }) => focusSection(sections[to]?.el));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      audio.toggleMute();
    }
    if (e.key === "1") router.set("home");
    if (e.key === "2") {
      window.open(brand.projectsRedirect, "_blank", "noopener,noreferrer");
    }
    if (e.key === "3") router.set("contact");
    if (e.key === "4") router.set("donate");
  });
}

function isMobileDevice() {
  const byWidth = window.matchMedia("(max-width: 920px)").matches;
  const byPointer = window.matchMedia("(pointer: coarse)").matches;
  const byUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return byWidth || byPointer || byUa;
}

function focusSection(sectionEl) {
  if (!sectionEl) return;
  const focusable = sectionEl.querySelector("[data-autofocus]") || sectionEl.querySelector("button, a, input, [tabindex='0']");
  if (focusable && typeof focusable.focus === "function") focusable.focus({ preventScroll: true });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

