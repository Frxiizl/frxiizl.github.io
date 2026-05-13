const ASSETS = {
  music: {
    bg: "/assets/sounds/bg.mp3",
  },
  sfx: {
    hover: "/assets/sounds/hover.wav",
    click: "/assets/sounds/click.wav",
    enter: "/assets/sounds/enter.wav",
  },
};

export function createAudio() {
  /** @type {AudioContext | null} */
  let ctx = null;
  let master = null;
  let musicEl = null;
  let musicNode = null;
  let muted = false;

  const buffers = new Map();

  async function init() {
    if (ctx) {
      if (ctx.state === "suspended") await ctx.resume();
      return;
    }

    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.85;
    master.connect(ctx.destination);

    await Promise.all(
      Object.entries(ASSETS.sfx).map(async ([k, url]) => {
        const res = await fetch(url);
        const arr = await res.arrayBuffer();
        const buf = await ctx.decodeAudioData(arr);
        buffers.set(k, buf);
      }),
    );
  }

  function ensure() {
    if (!ctx || !master) throw new Error("Audio not initialized");
  }

  function sfx(name) {
    if (muted) return;
    ensure();
    const buf = buffers.get(name);
    if (!buf) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = name === "hover" ? 0.5 : 0.8;
    src.connect(g);
    g.connect(master);
    src.start(0);
  }

  function music(name) {
    ensure();
    const url = ASSETS.music[name];
    if (!url) return;

    if (!musicEl) {
      musicEl = new Audio(url);
      musicEl.loop = true;
      musicEl.preload = "auto";
      musicEl.crossOrigin = "anonymous";
      musicEl.volume = 0.65;
      musicNode = ctx.createMediaElementSource(musicEl);
      musicNode.connect(master);
    } else {
      if (musicEl.src !== new URL(url, window.location.href).href) musicEl.src = url;
    }

    if (!muted) {
      const p = musicEl.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  }

  function toggleMute() {
    muted = !muted;
    if (master) master.gain.value = muted ? 0 : 0.85;
    if (musicEl) {
      if (muted) musicEl.pause();
      else {
        const p = musicEl.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    }
    document.documentElement.toggleAttribute("data-muted", muted);
  }

  return {
    get ctx() {
      return ctx;
    },
    get musicNode() {
      return musicNode;
    },
    init,
    sfx,
    music,
    toggleMute,
  };
}

