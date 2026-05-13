export function createVisualizer() {
  let analyser = null;
  let raf = 0;
  let ctx = null;
  let data = null;

  function attach({ audioContext, source }) {
    if (!audioContext || !source) return;
    ctx = audioContext;
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.88;
    source.connect(analyser);
    data = new Uint8Array(analyser.frequencyBinCount);
  }

  function start(canvas) {
    if (!analyser || !data) return;
    const g = canvas.getContext("2d", { alpha: true });
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const cssW = canvas.clientWidth || 900;
      const cssH = canvas.clientHeight || 250;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const draw = () => {
      raf = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);

      const w = canvas.clientWidth || 900;
      const h = canvas.clientHeight || 250;
      g.clearRect(0, 0, w, h);

      const bars = 28;
      const step = Math.floor(data.length / bars);
      const gap = 10;
      const bw = (w - gap * (bars - 1)) / bars;

      for (let i = 0; i < bars; i++) {
        let sum = 0;
        const base = i * step;
        for (let j = 0; j < step; j++) sum += data[base + j] || 0;
        const v = sum / step / 255;
        const barH = Math.pow(v, 1.6) * h * 0.72;
        const x = i * (bw + gap);
        const y = h - barH;

        g.globalAlpha = 0.6;
        g.fillStyle = "rgba(0, 0, 0, 0.14)";
        g.fillRect(x, y, bw, barH);

        g.globalAlpha = 1;
        g.fillStyle = "rgba(255, 255, 255, 0.7)";
        g.fillRect(x, y, bw, Math.max(2, barH * 0.62));

        g.fillStyle = "rgba(102, 102, 102, 0.25)";
        g.fillRect(x, h - 2, bw, 2);
      }
    };

    draw();
  }

  function stop() {
    cancelAnimationFrame(raf);
  }

  return { attach, start, stop };
}

