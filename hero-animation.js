/* ─────────────────────────────────────────────────────────────
   HERO ANIMATION

   Default state : "WEBSITE OF / Yijiang LIU" — always visible.
   On click      : comet orbits around the click point, on top of text.
   After comet   : text remains, no state change.
───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;
  let W = 0, H = 0;

  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!cometRun) paintText();
  }
  window.addEventListener("resize", resize);

  /* ── Comet parameters ───────────────────────────────────── */
  const R          = 115;
  const SPEED      = 0.018;
  const TAIL_ANGLE = 0.41 * 2;
  const TAIL_LEN   = TAIL_ANGLE * R;
  const SEGS       = 28;
  const WIDTH_HEAD = 3.2;
  const WIDTH_TAIL = 0.2;
  const EASE       = 1.6;

  let cometRun = null;

  /* ── Text is now rendered as HTML (.hero-identity) ── */
  function paintText() {
    /* no-op: title and bio are HTML elements overlaid on this canvas */
  }

  /* ── Comet draw ─────────────────────────────────────────── */
  function drawComet(getPoint) {
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.strokeStyle = "#111111";
    for (let i = 0; i < SEGS; i++) {
      const u0 = i / SEGS;
      const u1 = (i + 1) / SEGS;
      const e  = Math.pow(u1, EASE);
      const p0 = getPoint(u0);
      const p1 = getPoint(u1);
      ctx.globalAlpha = e;
      ctx.lineWidth   = WIDTH_TAIL + (WIDTH_HEAD - WIDTH_TAIL) * e;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /* ── Animation loop ─────────────────────────────────────── */
  function animate(r) {
    if (r.dead) return;

    const cx = r.cx;
    const cy = r.cy;

    ctx.clearRect(0, 0, W, H);
    paintText(); // text is always the bottom layer

    let finished = false;

    if (r.phase === "orbit") {
      r.angle += SPEED;
      r.bx = cx + R * Math.cos(r.angle);
      r.by = cy + R * Math.sin(r.angle);

      if (r.angle >= r.escapeAngle) {
        r.vx        = -Math.sin(r.angle);
        r.vy        =  Math.cos(r.angle);
        r.exitSpeed = SPEED * R;
        r.phase     = "flyoff";
      }

      const arcLen   = Math.min(TAIL_ANGLE, r.angle - r.startAngle);
      const arcStart = r.angle - arcLen;
      drawComet(u => ({
        x: cx + R * Math.cos(arcStart + u * arcLen),
        y: cy + R * Math.sin(arcStart + u * arcLen),
      }));

    } else {
      r.exitSpeed *= 1.045;
      r.bx += r.vx * r.exitSpeed;
      r.by += r.vy * r.exitSpeed;

      drawComet(u => ({
        x: r.bx - r.vx * TAIL_LEN * (1 - u),
        y: r.by - r.vy * TAIL_LEN * (1 - u),
      }));

      const margin = TAIL_LEN + 10;
      if (r.bx < -margin || r.bx > W + margin ||
          r.by < -margin || r.by > H + margin) {
        finished = true;
      }
    }

    if (finished) {
      cometRun = null;
      // Text already painted this frame; comet is off-screen — done.
    } else {
      requestAnimationFrame(() => animate(r));
    }
  }

  /* ── Launch comet at click position ────────────────────────*/
  function launch(clickX, clickY) {
    if (cometRun) cometRun.dead = true;

    const startAngle = Math.random() * Math.PI * 2;
    cometRun = {
      dead:        false,
      cx:          clickX,   // orbit centre = click point
      cy:          clickY,
      startAngle,
      angle:       startAngle,
      escapeAngle: startAngle + (1 + Math.random() * 4) * Math.PI * 2,
      phase:       "orbit",
      bx: 0, by: 0,
      vx: 0, vy: 0,
      exitSpeed:   0,
    };

    animate(cometRun);
  }

  /* ── Init ───────────────────────────────────────────────── */
  resize(); // sets W/H; paints text with whatever fonts are available

  // (no canvas text to repaint — text lives in .hero-identity HTML)

  canvas.style.cursor = "default";
  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    launch(e.clientX - rect.left, e.clientY - rect.top);
  });
})();
