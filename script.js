/* Lauhith Natarajan — site script. No dependencies.
   Everything here is an enhancement; the page reads fine with JS disabled. */
(() => {
  "use strict";

  const html = document.documentElement;
  html.classList.add("js");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Toronto clock ---------- */
  const clock = $("#clock");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto", hour: "2-digit", minute: "2-digit", hour12: false
    });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick();
    window.setInterval(tick, 20000);
  }

  /* ---------- Split words for masked reveals and the scroll fill ---------- */
  const wrapWords = (root, make) => {
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) frag.appendChild(document.createTextNode(tok));
            else frag.appendChild(make(tok));
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          walk(child);
        }
      });
    };
    walk(root);
  };

  $$("[data-split]").forEach((el) => {
    let i = 0;
    wrapWords(el, (tok) => {
      const w = document.createElement("span");
      w.className = "w";
      const s = document.createElement("span");
      s.style.setProperty("--i", String(i++));
      s.textContent = tok;
      w.appendChild(s);
      return w;
    });
  });

  const fillEl = $("[data-fill]");
  let fillWords = [];
  if (fillEl) {
    wrapWords(fillEl, (tok) => {
      const s = document.createElement("span");
      s.className = "fw";
      s.textContent = tok;
      return s;
    });
    fillWords = $$(".fw", fillEl);
  }

  /* ---------- Reveal on enter ---------- */
  const revealEls = $$(".reveal, [data-split]");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Scroll-linked state: nav, progress, pinned cards, word fill ---------- */
  const nav = $("#nav");
  const progress = $(".progress");
  const stack = $(".stack");
  const cards = $$(".stack .card");
  const stacked = window.matchMedia("(min-width: 861px)");
  let vh = window.innerHeight, docH = 1, lastY = window.scrollY;
  let stackTop = 0, cardStep = 1, fillTop = 0, fillH = 1, ticking = false;

  const measure = () => {
    vh = window.innerHeight;
    docH = Math.max(1, html.scrollHeight - vh);
    if (stack && cards.length) {
      stackTop = stack.getBoundingClientRect().top + window.scrollY;
      const cs = getComputedStyle(cards[0]);
      cardStep = cards[0].offsetHeight + parseFloat(cs.marginBottom || "0");
    }
    if (fillEl) {
      const r = fillEl.getBoundingClientRect();
      fillTop = r.top + window.scrollY;
      fillH = r.height;
    }
  };

  const update = () => {
    ticking = false;
    const y = window.scrollY;

    if (progress) progress.style.transform = `scaleX(${(y / docH).toFixed(4)})`;

    if (nav) {
      nav.classList.toggle("is-scrolled", y > 40);
      if (y > lastY + 4 && y > 240) nav.classList.add("is-hidden");
      else if (y < lastY - 4 || y <= 240) nav.classList.remove("is-hidden");
    }
    lastY = y;

    if (cards.length && stacked.matches) {
      cards.forEach((card, i) => {
        const start = stackTop + i * cardStep - vh * 0.08;
        const p = clamp((y - start) / vh, 0, 1);
        if (card._p !== p) { card._p = p; card.style.setProperty("--p", p.toFixed(4)); }
      });
    }

    if (fillWords.length) {
      const top = fillTop - y;
      const p = clamp((vh * 0.85 - top) / (fillH + vh * 0.25), 0, 1);
      const n = Math.round(p * fillWords.length);
      if (fillEl._n !== n) {
        fillEl._n = n;
        fillWords.forEach((w, i) => w.classList.toggle("on", i < n));
      }
    }
  };

  const requestUpdate = () => {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", () => { measure(); requestUpdate(); });
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => { measure(); requestUpdate(); }).observe(document.body);
  }
  measure();
  update();

  /* ---------- Count-up numbers ---------- */
  const counters = $$("[data-count]");
  if (counters.length) {
    const run = (el) => {
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0", 10);
      const pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      const fmt = new Intl.NumberFormat("en-CA", { minimumFractionDigits: dec, maximumFractionDigits: dec });
      if (reduce) { el.textContent = pre + fmt.format(end) + suf; return; }
      const t0 = performance.now(), dur = 1500;
      const step = (t) => {
        const k = clamp((t - t0) / dur, 0, 1);
        const e = k >= 1 ? 1 : 1 - Math.pow(2, -10 * k);
        el.textContent = pre + fmt.format(end * e) + suf;
        if (k < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.5 });
      counters.forEach((el) => io.observe(el));
    } else {
      counters.forEach(run);
    }
  }

  /* ---------- Inertia wheel scrolling (fine pointers only) ----------
     Native scrolling stays intact for keyboard, scrollbar, touch and anchors;
     only wheel input is eased, so sticky panels and observers keep working. */
  if (finePointer && !reduce) {
    let target = window.scrollY, current = target, animating = false;
    const maxY = () => Math.max(0, html.scrollHeight - window.innerHeight);
    const tick = () => {
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.5) { current = target; animating = false; }
      window.scrollTo({ top: current, behavior: "instant" });
      if (animating) window.requestAnimationFrame(tick);
    };
    window.addEventListener("wheel", (e) => {
      if (e.ctrlKey || e.defaultPrevented) return;
      const dlg = document.getElementById("case-dialog");
      if (dlg && dlg.open) return;
      if (e.target.closest && e.target.closest("dialog, [data-native-scroll]")) return;
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (!Number.isFinite(dy) || dy === 0) return;
      e.preventDefault();
      if (!animating) { current = window.scrollY; target = current; }
      target = clamp(target + dy, 0, maxY());
      if (!animating) { animating = true; window.requestAnimationFrame(tick); }
    }, { passive: false });
    window.addEventListener("scroll", () => { if (!animating) { current = target = window.scrollY; } }, { passive: true });
  }

  /* ---------- Custom cursor and magnetic buttons (fine pointers only) ---------- */
  if (finePointer && !reduce) {
    html.classList.add("has-cursor");
    const dot = $(".cursor-dot"), ring = $(".cursor"), label = $(".cursor-label");
    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0;

    const follow = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx.toFixed(1)}px, ${ry.toFixed(1)}px)`;
      raf = (Math.abs(mx - rx) > 0.2 || Math.abs(my - ry) > 0.2) ? window.requestAnimationFrame(follow) : 0;
    };

    let shown = false;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      if (!shown) { shown = true; rx = mx; ry = my; dot.style.opacity = "1"; ring.style.opacity = "1"; }
      if (!raf) raf = window.requestAnimationFrame(follow);
    }, { passive: true });

    document.addEventListener("mouseover", (e) => {
      const open = e.target.closest('[data-cursor="open"]');
      const link = e.target.closest("a, button, [data-cursor]");
      ring.classList.toggle("is-open", !!open);
      ring.classList.toggle("is-link", !!link && !open);
      label.textContent = open ? (open.dataset.cursorLabel || "Open") : "";
    });

    document.addEventListener("mouseleave", () => { dot.style.opacity = "0"; ring.style.opacity = "0"; });
    document.addEventListener("mouseenter", () => { dot.style.opacity = "1"; ring.style.opacity = "1"; });

    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.22).toFixed(1)}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Hero: noise converging into the name ---------- */
  const initSignal = () => {
    const canvas = $("#signal");
    if (!canvas) return;
    const hero = canvas.parentElement;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const TEXT = "LAUHITH";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999, on: false };
    let W = 0, H = 0, pts = [], dotSize = 2, running = false, raf = 0, t0 = 0;

    const build = () => {
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const o = off.getContext("2d", { willReadFrequently: true });
      // The name lives in the band between the nav and the headline block.
      const inner = hero.querySelector(".hero-inner");
      const heroTop = hero.getBoundingClientRect().top;
      const bandTop = 72, bandBottom = inner ? inner.getBoundingClientRect().top - heroTop : H * 0.55;
      const band = Math.max(120, bandBottom - bandTop);
      let size = Math.min(W * 0.22, band * 0.72);
      o.font = `900 ${size}px "Archivo"`;
      const tw = o.measureText(TEXT).width;
      if (tw > W * 0.88) { size *= (W * 0.88) / tw; o.font = `900 ${size}px "Archivo"`; }
      o.textAlign = "center"; o.textBaseline = "middle"; o.fillStyle = "#fff";
      o.fillText(TEXT, W / 2, bandTop + band * 0.52);

      const data = o.getImageData(0, 0, W, H).data;
      let gap = Math.max(3, Math.round(size / 54));
      let targets = [];
      const sample = () => {
        targets = [];
        for (let y = 0; y < H; y += gap) {
          for (let x = 0; x < W; x += gap) {
            if (data[(y * W + x) * 4 + 3] > 120) targets.push(x, y);
          }
        }
      };
      sample();
      while (targets.length / 2 > 5200) { gap += 1; sample(); }
      dotSize = Math.max(1.5, gap * 0.55);

      const n = targets.length / 2;
      const next = [];
      for (let i = 0; i < n; i++) {
        const old = pts[i];
        next.push({
          x: old ? old.x : Math.random() * W,
          y: old ? old.y : Math.random() * H,
          vx: old ? old.vx : (Math.random() - 0.5) * 2,
          vy: old ? old.vy : (Math.random() - 0.5) * 2,
          tx: targets[i * 2], ty: targets[i * 2 + 1],
          sx: Math.random() * W, sy: Math.random() * H * 1.3 - H * 0.15,
          c: Math.random() < 0.14 ? 1 : 0,
          j: Math.random() * Math.PI * 2
        });
      }
      pts = next;
      if (reduce) pts.forEach((p) => { p.x = p.tx; p.y = p.ty; });
    };

    const frame = (now) => {
      if (!running) return;
      const t = now - t0;
      const k = reduce ? 0.2 : clamp((t - 350) / 1500, 0, 1) * 0.07;
      const damp = 0.86;
      const d = reduce ? 0 : clamp(window.scrollY / (H * 0.7), 0, 1);
      const de = d * d * (3 - 2 * d);
      const R = 120, R2 = R * R;
      const useMouse = mouse.on && !reduce;

      for (const p of pts) {
        const tx = p.tx + (p.sx - p.tx) * de, ty = p.ty + (p.sy - p.ty) * de;
        let ax = (tx - p.x) * k, ay = (ty - p.y) * k;
        if (useMouse) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, q = dx * dx + dy * dy;
          if (q < R2 && q > 0.01) {
            const dist = Math.sqrt(q), f = (1 - dist / R) * 2.4;
            ax += (dx / dist) * f; ay += (dy / dist) * f;
          }
        }
        if (!reduce) { p.j += 0.02; ax += Math.cos(p.j * 3.1) * 0.02; ay += Math.sin(p.j * 2.3) * 0.02; }
        p.vx = (p.vx + ax) * damp; p.vy = (p.vy + ay) * damp;
        p.x += p.vx; p.y += p.vy;
      }

      draw(de);
      raf = window.requestAnimationFrame(frame);
    };

    const draw = (de) => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1 - de;
      ctx.fillStyle = "rgba(243,243,240,0.9)";
      for (const p of pts) if (!p.c) ctx.fillRect(p.x, p.y, dotSize, dotSize);
      ctx.fillStyle = "#b6ff5c";
      for (const p of pts) if (p.c) ctx.fillRect(p.x, p.y, dotSize, dotSize);
      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (running) return;
      running = true;
      if (!t0) t0 = performance.now();
      raf = window.requestAnimationFrame(frame);
    };
    const stop = () => { running = false; if (raf) window.cancelAnimationFrame(raf); raf = 0; };

    const toLocal = (cx, cy) => {
      const r = hero.getBoundingClientRect();
      mouse.x = cx - r.left; mouse.y = cy - r.top; mouse.on = true;
    };
    window.addEventListener("mousemove", (e) => toLocal(e.clientX, e.clientY), { passive: true });
    hero.addEventListener("touchmove", (e) => { const t = e.touches[0]; if (t) toLocal(t.clientX, t.clientY); }, { passive: true });
    hero.addEventListener("touchend", () => { mouse.on = false; }, { passive: true });
    document.addEventListener("mouseleave", () => { mouse.on = false; });

    let rt = 0;
    window.addEventListener("resize", () => { window.clearTimeout(rt); rt = window.setTimeout(build, 150); });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0.02 }).observe(hero);
    } else {
      start();
    }
    document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else start(); });

    const ready = document.fonts && document.fonts.load
      ? Promise.race([document.fonts.load('900 120px "Archivo"'), new Promise((r) => window.setTimeout(r, 1500))])
      : Promise.resolve();
    ready.then(() => { build(); if (!running) start(); measure(); requestUpdate(); });

    // Screenshot harness only: jump straight to the settled state.
    if (window.location.search.includes("harness=1")) {
      window.__settle = () => { stop(); pts.forEach((p) => { p.x = p.tx; p.y = p.ty; p.vx = 0; p.vy = 0; }); draw(0); };
    }
  };
  initSignal();

  /* ---------- Annotated figures: markers <-> notes ---------- */
  const initAnnotations = (root) => {
    const marks = $$(".mark", root);
    const notes = $$(".notes li", root);
    const set = (i, on) => {
      marks[i]?.classList.toggle("is-active", on);
      notes[i]?.classList.toggle("is-active", on);
    };
    marks.forEach((m, i) => {
      m.addEventListener("mouseenter", () => set(i, true));
      m.addEventListener("mouseleave", () => set(i, false));
      m.addEventListener("focus", () => set(i, true));
      m.addEventListener("blur", () => set(i, false));
      m.addEventListener("click", () => {
        marks.forEach((_, j) => set(j, false));
        set(i, true);
        notes[i]?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
      });
    });
    notes.forEach((n, i) => {
      n.addEventListener("mouseenter", () => set(i, true));
      n.addEventListener("mouseleave", () => set(i, false));
    });
  };

  /* ---------- Case study dialog with a shared-element morph ---------- */
  const dialogEl = $("#case-dialog");
  const dialog = dialogEl;
  const panel = dialog ? $(".case-panel", dialog) : null;
  const canMorph = () => typeof document.startViewTransition === "function" && !reduce;
  let activeCard = null;

  const openCase = (card) => {
    if (!dialog || !panel) return;
    const source = $(".case-content", card);
    const cardImg = $(".card-fig img", card);
    if (!source) return;

    const clone = source.cloneNode(true);
    clone.hidden = false;
    $$("[id]", clone).forEach((el) => { el.id = `d-${el.id}`; });
    $$("[aria-describedby]", clone).forEach((el) => { el.setAttribute("aria-describedby", `d-${el.getAttribute("aria-describedby")}`); });

    const show = () => {
      panel.replaceChildren(clone);
      html.classList.add("case-open");
      dialog.showModal();
      dialog.scrollTop = 0;
      initAnnotations(panel);
      if (cardImg) cardImg.style.viewTransitionName = "";
      const fig = $(".figure img", panel);
      if (fig) fig.style.viewTransitionName = "case-fig";
    };

    activeCard = card;
    let morphed = false;
    if (canMorph() && cardImg) {
      try {
        cardImg.style.viewTransitionName = "case-fig";
        const vt = document.startViewTransition(show);
        const done = () => { const fig = $(".figure img", panel); if (fig) fig.style.viewTransitionName = ""; };
        vt.finished.then(done, done);
        morphed = true;
      } catch (err) {
        cardImg.style.viewTransitionName = "";
      }
    }
    if (!morphed) {
      if (!dialog.open) show();
      const fig = $(".figure img", panel);
      if (fig) fig.style.viewTransitionName = "";
    }
  };

  const closeCase = () => {
    if (!dialog || !dialog.open) return;
    const fig = $(".figure img", panel);
    const cardImg = activeCard ? $(".card-fig img", activeCard) : null;
    const hide = () => {
      dialog.close();
      html.classList.remove("case-open");
      if (fig) fig.style.viewTransitionName = "";
      if (cardImg) cardImg.style.viewTransitionName = "case-fig";
    };
    let morphed = false;
    if (canMorph() && fig && cardImg) {
      try {
        fig.style.viewTransitionName = "case-fig";
        const vt = document.startViewTransition(hide);
        const done = () => { cardImg.style.viewTransitionName = ""; panel.replaceChildren(); };
        vt.finished.then(done, done);
        morphed = true;
      } catch (err) {
        fig.style.viewTransitionName = "";
      }
    }
    if (!morphed) {
      if (dialog.open) hide();
      if (cardImg) cardImg.style.viewTransitionName = "";
      panel.replaceChildren();
    }
    const btn = activeCard ? $(".card-open", activeCard) : null;
    if (btn) btn.focus({ preventScroll: true });
  };

  if (dialog) {
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".case-content")) return;
        if (e.target.closest("a")) return;
        openCase(card);
      });
    });
    $(".case-close", dialog)?.addEventListener("click", closeCase);
    dialog.addEventListener("cancel", (e) => { e.preventDefault(); closeCase(); });
    dialog.addEventListener("click", (e) => { if (e.target === dialog) closeCase(); });
  }

  /* ---------- Footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
