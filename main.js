/* =========================================================
   EDIT YOUR DETAILS HERE
   ========================================================= */
const CONFIG = {
  whatsapp: "2349069288459",            // full number, country code first, digits only
  whatsappMessage: "Hi Clinton, I saw your portfolio and I'd like to talk about a website project.",
  email: "nnoshiriclinton10@gmail.com",
  calendly: "https://calendly.com/nnoshiriclinton10/30min",                         // your Calendly booking link, e.g. https://calendly.com/your-name/30min
};

const PROJECTS = [
  { name: "Ayadi — London MedSpa & Laser Clinic", url: "https://ayaditherapy.com/", cats: ["business"], tags: ["Elementor", "On-page SEO"], text: "Full Elementor build for a London medspa and laser clinic, with on-page SEO so treatments are easy to find." },
  { name: "Revolution Beauty", url: "https://www.revolutionbeauty.com/", cats: ["ecommerce", "redesign"], tags: ["WooCommerce", "Redesign"], text: "WooCommerce redesign for a beauty e-commerce store — product-first layouts that look premium on every device." },
  { name: "Headmasters Salons", url: "https://www.headmasters.com/", cats: ["business", "care"], tags: ["Development", "Migration"], text: "Development work and a full website migration for a salon group, moved safely with everything working on the other side." },
  { name: "Rosy — Boutique Fitness Studio", url: "https://rosy-longevity.club/", cats: ["business"], tags: ["Bookings", "Memberships", "SEO"], text: "Class booking, memberships and SEO for a boutique fitness studio." },
  { name: "Sunny Days Electrical", url: "https://sunnydayselectrical.com.au/", cats: ["care"], tags: ["Bug fixing", "Maintenance"], text: "Ongoing bug fixing and maintenance for an Australian electrical contractor." },
  { name: "Scott Nelson Electric — Illinois", url: "https://ilelectrician.com/", cats: ["business"], tags: ["Elementor", "Service areas"], text: "Elementor build for a US electrician, with service-area pages and free-estimate requests to bring in local jobs." },
  { name: "Swedencare UK — Pet Health", url: "https://uk.swedencare.com/", cats: ["ecommerce", "redesign"], tags: ["E-commerce", "Redesign"], text: "E-commerce redesign for a pet health and supplements store." },
  { name: "Xpress Logistic", url: "https://www.xpresslogistic.co.uk/", cats: ["business", "redesign"], tags: ["Redesign"], text: "Redesign for a UK air cargo and logistics company — clearer services, stronger credibility." },
  { name: "Verdantas", url: "https://www.verdantas.com/", cats: ["business"], tags: ["Development"], text: "Development work for an engineering and environmental consulting firm." },
  { name: "Prime Home Trends", url: "https://primehometrends.ca/", cats: ["business"], tags: ["Web design"], text: "Website design for a tile, flooring and wall-panel showroom in Mississauga, Canada." },
  { name: "Unite Clean", url: "https://uniteclean.co.uk/", cats: ["business"], tags: ["Web design"], text: "Website design for a London cleaning services company." },
];

const REVIEWS = [
  { text: "Clinton was great to work with again. He quickly fixed the header issue on my WordPress website mobile view and made sure everything was working properly and looking right across devices. He was responsive, professional, and completed the task exactly as I needed. I'd definitely work with him again and again.", job: "WordPress mobile header fix · Repeat client" },
  { text: "Clinton did a great job with my WordPress website redesign using Elementor. He understood my requirements, made the changes, and delivered a clean and responsive design. The hero section redesign looked especially good on mobile, and he made sure everything worked properly without affecting the rest of the site. I would definitely hire Clinton again.", job: "Elementor website redesign" },
  { text: "Clinton did an excellent job fixing the Elementor section on my website. He understood what needed to be done, communicated clearly, and completed the task quickly. I'm happy with the result and would gladly work with him again.", job: "Elementor section fix" },
  { text: "Clinton did a great job updating my WordPress service page. He followed my instructions, and completed the work quickly. I'm happy with the result.", job: "WordPress service page update" },
];

// Countries served — code is the 2-letter country code (used for the flag image)
const COUNTRIES = [
  { code: "gb", name: "United Kingdom" },
  { code: "us", name: "United States" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "de", name: "Germany" },
  { code: "nl", name: "Netherlands" },
];

// Holiday offer — ends automatically at this date/time (Lagos time)
const OFFER = { ends: "2026-12-31T23:59:59+01:00", discount: 0.2 };

/* ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = matchMedia("(hover: none)").matches;

/* ---------- live screenshots (WordPress mShots) ---------- */
function shotURL(url, { w = 1280, h = 960, mobile = false } = {}) {
  const base = "https://s0.wp.com/mshots/v1/" + encodeURIComponent(url);
  return mobile ? `${base}?vpw=414&vph=896&w=414&h=896` : `${base}?w=${w}&h=${h}`;
}
function loadShot(img, src, onReady, tries = 0) {
  // mShots returns a "Generating Preview…" GIF while it captures a site, and a small
  // error JPEG if it can't. Only show a real screenshot; otherwise retry quietly.
  const retry = () => { if (tries < 12) setTimeout(() => loadShot(img, src, onReady, tries + 1), 4000); };
  const url = src; // same URL each retry (a changed URL makes mShots start a new capture)
  fetch(url, { mode: "cors", cache: "no-store" })
    .then(r => r.ok ? r.blob() : Promise.reject(r.status))
    .then(blob => {
      if (/gif/.test(blob.type) || blob.size < 35000) return retry();
      const obj = URL.createObjectURL(blob);
      if (img) img.src = obj;
      onReady && onReady(obj);
    })
    .catch(() => {
      // fallback if the browser blocks the fetch: size check only
      const probe = new Image();
      probe.onload = () => {
        if (probe.naturalWidth <= 400) return retry();
        if (img) img.src = probe.src;
        onReady && onReady(probe.src);
      };
      probe.onerror = retry;
      probe.src = url;
    });
}

/* ---------- contact links ---------- */
(function contact() {
  const wa = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
  $("#waLink").href = wa;
  $$(".wa-btn").forEach(a => a.href = wa);
  $$(".mail-btn").forEach(a => a.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Website project enquiry")}`);
  $("#mailLink").href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Website project enquiry")}`;
  $("#mailText").textContent = CONFIG.email;
  $("#year").textContent = new Date().getFullYear();
})();

/* ---------- Calendly ---------- */
(function calendly() {
  const triggers = [$("#calendlyBtn"), ...$$("[data-calendly]")];
  window.openCalendly = () => document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
  if (!CONFIG.calendly) { triggers.forEach(t => t.hidden = true); return; }
  let loading;
  function loadWidget() {
    if (window.Calendly) return Promise.resolve();
    if (loading) return loading;
    const css = document.createElement("link");
    css.rel = "stylesheet"; css.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(css);
    loading = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.onload = res; s.onerror = e => { loading = null; rej(e); };
      document.head.appendChild(s);
    });
    return loading;
  }
  window.openCalendly = () => loadWidget()
    .then(() => window.Calendly.initPopupWidget({ url: CONFIG.calendly + (CONFIG.calendly.includes("?") ? "&" : "?") + "hide_gdpr_banner=1&background_color=0e1621&text_color=e9f1f7&primary_color=5fe0c4" }))
    .catch(() => window.open(CONFIG.calendly, "_blank", "noopener"));
  window.warmCalendly = loadWidget;
  triggers.forEach(t => {
    t.href = CONFIG.calendly; t.target = "_blank"; t.rel = "noopener";
    t.addEventListener("pointerenter", () => loadWidget().catch(() => {}), { once: true });
    t.addEventListener("click", e => { e.preventDefault(); window.openCalendly(); });
  });
})();

/* ---------- contact form (delivered by FormSubmit to CONFIG.email) ---------- */
(function contactForm() {
  const form = $("#contactForm"), status = $("#formStatus"), btn = $(".submit", form), label = $(".label", btn);
  const setStatus = (msg, cls = "") => { status.textContent = msg; status.className = "form-status " + cls; };
  form.addEventListener("input", e => e.target.closest(".field")?.classList.remove("invalid"));
  form.addEventListener("submit", async e => {
    e.preventDefault();
    let ok = true;
    $$("[required]", form).forEach(f => {
      const bad = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
      f.closest(".field").classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) return setStatus("Please fill in the highlighted fields.", "err");
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return; // bot
    btn.classList.add("loading"); label.textContent = "Sending…"; setStatus("");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Name: data.name, Email: data.email, Service: data.service,
          Budget: data.budget || "Not sure yet", Website: data.website || "—", Message: data.message,
          _replyto: data.email, _subject: `New project enquiry from ${data.name}`, _template: "table", _captcha: "false",
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || String(out.success) !== "true") throw new Error(out.message || "Failed");
      form.reset();
      label.textContent = "Message sent ✓";
      setStatus(`Thanks, ${data.name.split(" ")[0]}! I'll get back to you shortly.`, "ok");
      setTimeout(() => label.textContent = "Send message", 4000);
    } catch (err) {
      console.warn("Form not sent:", err && err.message);
      label.textContent = "Send message";
      // Never lose the lead: offer to send the same message on WhatsApp in one tap
      const text = `Hi Clinton, I'm ${data.name} (${data.email}).\nService: ${data.service}\nBudget: ${data.budget || "Not sure yet"}\nWebsite: ${data.website || "—"}\n\n${data.message}`;
      status.className = "form-status err";
      status.innerHTML = `Sorry, the form couldn't send just now. <a class="form-wa" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}">Send this message on WhatsApp instead →</a>`;
    } finally {
      btn.classList.remove("loading");
    }
  });
})();

/* ---------- holiday offer: banner, countdown, prices ---------- */
(function offer() {
  const end = new Date(OFFER.ends).getTime();
  const active = () => Date.now() < end;
  const bar = $("#promoBar"), section = $("#offer");
  let dismissed = false;
  try { dismissed = sessionStorage.getItem("promoClosed") === "1"; } catch (e) {}

  function applyPrices(on) {
    $$(".amount[data-price]").forEach(a => {
      if (a.dataset.per) return;
      const p = +a.dataset.price, old = $(".old", a), now = $("b", a);
      now.textContent = "$" + (on ? Math.round(p * (1 - OFFER.discount)) : p);
      if (old) old.hidden = !on;
    });
    $$("[data-offer]").forEach(el => el.hidden = !on);
  }
  if (!active()) { applyPrices(false); return; }

  if (section) section.hidden = false;
  if (!dismissed) { bar.hidden = false; document.body.classList.add("has-bar"); }
  $("#promoClose").addEventListener("click", () => {
    bar.hidden = true; document.body.classList.remove("has-bar");
    try { sessionStorage.setItem("promoClosed", "1"); } catch (e) {}
  });
  applyPrices(true);

  const pad = n => String(n).padStart(2, "0");
  const short = $("[data-countdown='short']"), units = {};
  $$("[data-countdown='full'] b").forEach(b => units[b.dataset.u] = b);
  function tick() {
    const left = end - Date.now();
    if (left <= 0) { bar.hidden = true; if (section) section.hidden = true; document.body.classList.remove("has-bar"); applyPrices(false); return; }
    const d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60, s = Math.floor(left / 1e3) % 60;
    short.textContent = `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
    const vals = { d: pad(d), h: pad(h), m: pad(m), s: pad(s) };
    for (const k in vals) if (units[k] && units[k].textContent !== vals[k]) {
      units[k].textContent = vals[k];
      units[k].classList.remove("tick"); void units[k].offsetWidth; units[k].classList.add("tick");
    }
    setTimeout(tick, 1000 - (Date.now() % 1000));
  }
  tick();
})();

/* ---------- problem cards: tap to flip on touch screens ---------- */
$$(".problem").forEach(c => c.addEventListener("click", e => { if (!e.target.closest("a")) c.classList.toggle("flipped"); }));

/* ---------- package buttons pre-fill the contact form ---------- */
$$(".plan-btn").forEach(btn => btn.addEventListener("click", () => {
  const form = $("#contactForm"), sel = $("select[name=service]", form), msg = $("textarea[name=message]", form);
  sel.value = btn.dataset.service;
  if (!msg.value.trim()) msg.value = btn.closest(".problem")
    ? `Hi Clinton, my website has this problem: ${btn.closest(".problem").querySelector("h3").textContent}. Can you help? `
    : btn.dataset.plan === "Digital Marketing" ? "Hi Clinton, I'd like to know more about your digital marketing services. "
    : `Hi Clinton, I'm interested in the ${btn.dataset.plan} package.` + (Date.now() < new Date(OFFER.ends).getTime() ? " I'd like to claim the holiday 20% discount." : "") + " ";
  setTimeout(() => $("input[name=name]", form).focus({ preventScroll: true }), 900);
}));

/* ---------- nav ---------- */
const nav = $(".nav"), burger = $("#burger"), links = $("#navLinks");
burger.addEventListener("click", () => { burger.classList.toggle("open"); links.classList.toggle("open"); });
$$("a", links).forEach(a => a.addEventListener("click", () => { burger.classList.remove("open"); links.classList.remove("open"); }));
const prog = $(".scroll-progress");
addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", scrollY > 40);
  const max = document.documentElement.scrollHeight - innerHeight;
  prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
}, { passive: true });

/* ---------- cursor glow ---------- */
const glow = $(".cursor-glow");
if (!isTouch) addEventListener("pointermove", e => { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; });

/* ---------- split headlines ---------- */
$$(".split").forEach(h => {
  const words = h.textContent.trim().split(/\s+/);
  h.innerHTML = words.map((w, i) =>
    `<span class="w${i >= words.length - 2 ? " grad" : ""}" style="--i:${i}"><span>${w}</span></span>`
  ).join(" ");
});

/* ---------- HERO SLIDER ---------- */
(function slider() {
  const slides = $$(".slide"), bars = $("#bars"), now = $("#slideNow");
  const DURATION = 7000;
  let idx = 0, timer, startX = null;

  slides.forEach((s, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.innerHTML = "<i></i>";
    b.onclick = () => go(i);
    bars.appendChild(b);
    const bg = $(".slide-bg", s);
    loadShot(null, shotURL(s.dataset.bg, { w: 1600, h: 1000 }), src => bg.style.backgroundImage = `url("${src}")`);
  });
  $$("[data-shot]").forEach(img => loadShot(img, shotURL(img.dataset.shot, { w: 1280, h: 900, mobile: img.hasAttribute("data-mobile") })));

  function paintBars() {
    $$("button", bars).forEach((b, i) => {
      const bar = $("i", b);
      bar.style.transition = "none";
      bar.style.transform = `scaleX(${i < idx ? 1 : 0})`;
      if (i === idx) {
        void bar.offsetWidth;
        bar.style.transition = `transform ${DURATION}ms linear`;
        bar.style.transform = "scaleX(1)";
      }
    });
  }
  function go(n) {
    const prev = slides[idx];
    idx = (n + slides.length) % slides.length;
    if (prev !== slides[idx]) {
      prev.classList.add("leaving");
      setTimeout(() => prev.classList.remove("leaving"), 700);
      prev.classList.remove("is-active");
      // restart layer animations
      const next = slides[idx];
      next.classList.remove("is-active"); void next.offsetWidth; next.classList.add("is-active");
    }
    now.textContent = String(idx + 1).padStart(2, "0");
    paintBars();
    if (slides[idx].querySelector(".typer")) runTyper(slides[idx].querySelector(".typer"));
    clearTimeout(timer);
    if (!reduced) timer = setTimeout(() => go(idx + 1), DURATION);
  }
  $(".arrow.next").onclick = () => go(idx + 1);
  $(".arrow.prev").onclick = () => go(idx - 1);
  addEventListener("keydown", e => {
    if (scrollY > innerHeight * .6) return;
    if (e.key === "ArrowRight") go(idx + 1);
    if (e.key === "ArrowLeft") go(idx - 1);
  });
  const hero = $("#hero");
  hero.addEventListener("touchstart", e => startX = e.touches[0].clientX, { passive: true });
  hero.addEventListener("touchend", e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
    startX = null;
  });
  document.addEventListener("visibilitychange", () => document.hidden ? clearTimeout(timer) : go(idx));
  $$("[data-filter-link]").forEach(a => a.addEventListener("click", () => setFilter(a.dataset.filterLink)));
  go(0);
})();

/* ---------- typer ---------- */
let typerRun = 0;
function runTyper(el) {
  const run = ++typerRun;
  const lines = JSON.parse(el.dataset.lines);
  let out = "", li = 0, ci = 0;
  el.innerHTML = '<span class="caret"></span>';
  (function tick() {
    if (run !== typerRun) return;
    if (li >= lines.length) return;
    const line = lines[li];
    if (ci <= line.length) {
      el.innerHTML = out + line.slice(0, ci) + '<span class="caret"></span>';
      ci++; setTimeout(tick, 28);
    } else {
      out += line + "\n"; li++; ci = 0; setTimeout(tick, 260);
    }
  })();
}

/* ---------- particle network ---------- */
(function particles() {
  const c = $("#particles"), ctx = c.getContext("2d");
  let W, H, pts = [], mouse = { x: -999, y: -999 };
  const DPR = Math.min(devicePixelRatio || 1, 2);
  function size() {
    W = c.clientWidth; H = c.clientHeight;
    c.width = W * DPR; c.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.min(90, Math.floor(W * H / 16000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 1.6 + .6 }));
  }
  size(); addEventListener("resize", size);
  $("#hero").addEventListener("pointermove", e => { const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  $("#hero").addEventListener("pointerleave", () => mouse.x = mouse.y = -999);
  function frame() {
    if (scrollY < innerHeight) {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 160) { p.vx += dx / d * .02; p.vy += dy / d * .02; }
        p.vx *= .99; p.vy *= .99;
        p.x += p.vx + (Math.random() - .5) * .05; p.y += p.vy + (Math.random() - .5) * .05;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) { ctx.strokeStyle = `rgba(95,224,196,${(1 - d / 130) * .25})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        ctx.fillStyle = "rgba(47,169,236,.8)"; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 7); ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  }
  if (!reduced) frame();
})();

/* ---------- projects ---------- */
function renderProjects() {
  const grid = $("#projectGrid");
  grid.innerHTML = PROJECTS.map((p, i) => `
    <article class="project reveal" data-cats="${p.cats.join(" ")}">
      <a class="shot" data-host="${new URL(p.url).hostname.replace(/^www\./, "")}" href="${p.url}" target="_blank" rel="noopener" aria-label="Visit ${p.name}">
        <span class="visit">Visit live site ↗</span>
        <img alt="Screenshot of ${p.name}" data-i="${i}" />
      </a>
      <div class="project-body">
        <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
        <h3>${p.name}</h3>
        <p>${p.text}</p>
      </div>
    </article>`).join("");
  // lazy-load screenshots as they approach the viewport
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    const img = $("img", en.target), p = PROJECTS[img.dataset.i];
    loadShot(img, shotURL(p.url, { w: 1280, h: 960 }), () => en.target.classList.add("loaded"));
  }), { rootMargin: "400px" });
  $$(".shot", grid).forEach(s => io.observe(s));
}
renderProjects();

function setFilter(f) {
  $$(".filter").forEach(b => b.classList.toggle("is-on", b.dataset.filter === f));
  $$(".project").forEach((p, i) => {
    const show = f === "all" || p.dataset.cats.split(" ").includes(f);
    p.classList.toggle("hide", !show);
    p.classList.remove("pop");
    if (show) { void p.offsetWidth; p.style.animationDelay = (i % 6) * 60 + "ms"; p.classList.add("pop", "in"); }
  });
}
$$(".filter").forEach(b => b.addEventListener("click", () => setFilter(b.dataset.filter)));

/* ---------- countries ---------- */
$("#flags").innerHTML = COUNTRIES.map(c =>
  `<img src="https://flagcdn.com/${c.code}.svg" alt="${c.name}" title="${c.name}" width="26" height="18" loading="lazy" />`).join("");

/* ---------- reviews carousel ---------- */
(function reviews() {
  const track = $("#reviewTrack"), dots = $("#reviewDots");
  track.innerHTML = REVIEWS.map(r => `
    <div class="review"><blockquote>${r.text}
      <footer><span class="stars">★★★★★</span><span><b>Upwork client</b><small>${r.job}</small></span></footer>
    </blockquote></div>`).join("");
  let i = 0, t;
  REVIEWS.forEach((_, n) => { const b = document.createElement("button"); b.setAttribute("aria-label", `Review ${n + 1}`); b.onclick = () => show(n); dots.appendChild(b); });
  function show(n) {
    i = (n + REVIEWS.length) % REVIEWS.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    $$("button", dots).forEach((b, k) => b.classList.toggle("on", k === i));
    clearTimeout(t); if (!reduced) t = setTimeout(() => show(i + 1), 6500);
  }
  let sx = null;
  track.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
  track.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1)); sx = null; });
  show(0);
})();

/* ---------- reveal ---------- */
const revealIO = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add("in");
  revealIO.unobserve(en.target);
}), { threshold: .15 });
$$(".reveal").forEach(el => revealIO.observe(el));

/* ---------- stat counters: replay every time they come into view ---------- */
const statRuns = new WeakMap();
const statsIO = new IntersectionObserver(entries => entries.forEach(en => {
  const card = en.target, num = $("[data-count]", card);
  if (en.isIntersecting) {
    const delay = [...card.parentNode.children].indexOf(card) * 180;
    setTimeout(() => countUp(num, card), delay);
  } else {
    statRuns.set(num, (statRuns.get(num) || 0) + 1); // cancel any run in progress
    num.textContent = "0" + (num.dataset.suffix || "");
    card.classList.remove("landed");
  }
}), { threshold: .6 });
$$(".stat").forEach(s => statsIO.observe(s));
function countUp(el, card) {
  const run = (statRuns.get(el) || 0) + 1; statRuns.set(el, run);
  const end = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now(), dur = reduced ? 1 : 2500;
  card.classList.remove("landed");
  (function step(t) {
    if (statRuns.get(el) !== run) return;
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
    el.textContent = Math.round(end * e) + suf;
    if (k < 1) requestAnimationFrame(step);
    else { void card.offsetWidth; card.classList.add("landed"); }
  })(t0);
}

/* ---------- 3D tilt + spotlight cards ---------- */
if (!isTouch) $$(".tilt").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.transform = `rotateY(${(x - .5) * 10}deg) rotateX(${(.5 - y) * 10}deg)`;
    card.style.setProperty("--mx", x * 100 + "%"); card.style.setProperty("--my", y * 100 + "%");
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});

/* ---------- magnetic buttons ---------- */
if (!isTouch) $$(".magnetic").forEach(b => {
  b.addEventListener("pointermove", e => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
  });
  b.addEventListener("pointerleave", () => b.style.transform = "");
});

/* ---------- contact aurora ---------- */
(function aurora() {
  const c = $("#contactGlow"), ctx = c.getContext("2d");
  const blobs = [
    { c: "47,169,236", r: .55, s: .00031, o: 0 },
    { c: "95,224,196", r: .45, s: .00023, o: 2 },
    { c: "36,102,173", r: .6, s: .00017, o: 4 },
  ];
  let W, H, visible = false;
  function size() { W = c.width = c.clientWidth; H = c.height = c.clientHeight; }
  size(); addEventListener("resize", size);
  new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(c);
  function frame(t) {
    if (visible) {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (const b of blobs) {
        const x = W * (.5 + .38 * Math.sin(t * b.s + b.o)), y = H * (.5 + .35 * Math.cos(t * b.s * 1.3 + b.o));
        const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(W, H) * b.r);
        g.addColorStop(0, `rgba(${b.c},.28)`); g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
    }
    requestAnimationFrame(frame);
  }
  if (!reduced) requestAnimationFrame(frame);
})();
