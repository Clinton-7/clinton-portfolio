/* =========================================================
   Holiday offer popup + Clinton's site assistant (scripted chat)
   Uses CONFIG, OFFER and openCalendly from main.js
   ========================================================= */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
  };
  const offerOn = () => Date.now() < new Date(OFFER.ends).getTime();
  const goTo = sel => { const el = $(sel); if (el) el.scrollIntoView({ behavior: "smooth" }); };
  const waLink = () => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;

  /* ---------------- HOLIDAY POPUP ---------------- */
  const pop = document.createElement("div");
  pop.className = "hp-overlay";
  pop.hidden = true;
  pop.innerHTML = `
    <div class="hp-modal" role="dialog" aria-modal="true" aria-labelledby="hpTitle">
      <button class="hp-close" aria-label="Close">×</button>
      <div class="hp-glow" aria-hidden="true"></div>
      <span class="hp-tag">🎁 Holiday offer</span>
      <h2 id="hpTitle"><span class="hp-big">20% OFF</span> every website package</h2>
      <p>Plus a <b>free website audit</b> when you book a call. Book before 31 December to lock in your discount.</p>
      <div class="hp-clock" aria-label="Time left"><div><b data-u="d">00</b><span>days</span></div><div><b data-u="h">00</b><span>hrs</span></div><div><b data-u="m">00</b><span>min</span></div><div><b data-u="s">00</b><span>sec</span></div></div>
      <div class="hp-actions">
        <button class="btn hp-claim">Claim 20% off</button>
        <button class="btn btn-ghost hp-audit">Book free audit</button>
      </div>
      <button class="hp-later">No thanks, maybe later</button>
    </div>`;
  document.body.appendChild(pop);

  let clockTimer;
  function runClock() {
    const end = new Date(OFFER.ends).getTime(), pad = n => String(n).padStart(2, "0");
    const left = Math.max(0, end - Date.now());
    const v = { d: Math.floor(left / 864e5), h: Math.floor(left / 36e5) % 24, m: Math.floor(left / 6e4) % 60, s: Math.floor(left / 1e3) % 60 };
    for (const k in v) $(`[data-u="${k}"]`, pop).textContent = pad(v[k]);
    clockTimer = setTimeout(runClock, 1000);
  }
  function openPop() {
    pop.hidden = false; runClock();
    requestAnimationFrame(() => pop.classList.add("show"));
    store.set("hpSeen", "1");
    setTimeout(() => $(".hp-claim", pop).focus({ preventScroll: true }), 400);
  }
  function closePop() {
    pop.classList.remove("show"); clearTimeout(clockTimer);
    setTimeout(() => { pop.hidden = true; }, 350);
    scheduleTeaser(8000);
  }
  pop.addEventListener("click", e => { if (e.target === pop) closePop(); });
  $(".hp-close", pop).onclick = closePop;
  $(".hp-later", pop).onclick = closePop;
  $(".hp-claim", pop).onclick = () => { closePop(); goTo("#pricing"); };
  $(".hp-audit", pop).onclick = () => { closePop(); window.openCalendly(); };
  addEventListener("keydown", e => { if (e.key === "Escape" && !pop.hidden) closePop(); });

  const popWanted = offerOn() && !store.get("hpSeen");
  if (popWanted) setTimeout(() => { if (!chatOpen) openPop(); else scheduleTeaser(0); }, 3500);

  /* ---------------- CHAT ASSISTANT ---------------- */
  const root = document.createElement("div");
  root.className = "cb";
  root.innerHTML = `
    <div class="cb-teaser" hidden><button class="cb-teaser-x" aria-label="Dismiss">×</button><span>👋 Hi! Need a new website or a fix? I can help in seconds.</span></div>
    <button class="cb-launch" aria-label="Open chat assistant" aria-expanded="false">
      <span class="cb-ico-open"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m3 6.5a1.5 1.5 0 1 0 0 .01zm5 0a1.5 1.5 0 1 0 0 .01zm5 0a1.5 1.5 0 1 0 0 .01z"/></svg></span>
      <span class="cb-ico-close">×</span>
      <span class="cb-ping" aria-hidden="true"></span>
    </button>
    <section class="cb-panel" aria-label="Chat with Clinton's assistant" hidden>
      <header class="cb-head">
        <img src="/assets/clinton.jpg" alt="" class="cb-avatar" />
        <div><b>Clinton's Assistant</b><small><span class="cb-online"></span>Typically replies instantly</small></div>
        <button class="cb-x" aria-label="Close chat">×</button>
      </header>
      <div class="cb-body" role="log" aria-live="polite"></div>
      <div class="cb-chips"></div>
      <form class="cb-input"><input type="text" placeholder="Type your question…" aria-label="Type your question" autocomplete="off" /><button aria-label="Send">➤</button></form>
    </section>`;
  document.body.appendChild(root);
  const launch = $(".cb-launch", root), panel = $(".cb-panel", root), body = $(".cb-body", root), chips = $(".cb-chips", root),
        input = $(".cb-input input", root), teaser = $(".cb-teaser", root);
  let chatOpen = false, started = false, flow = null, lead = {};

  function toggle(open = !chatOpen) {
    chatOpen = open;
    root.classList.toggle("open", open);
    launch.setAttribute("aria-expanded", open);
    panel.hidden = !open;
    teaser.hidden = true; store.set("cbTeased", "1");
    if (open && !started) { started = true; greet(); }
    if (open) setTimeout(() => input.focus({ preventScroll: true }), 250);
  }
  launch.onclick = () => toggle();
  $(".cb-x", root).onclick = () => toggle(false);
  $(".cb-teaser-x", root).onclick = e => { e.stopPropagation(); teaser.hidden = true; store.set("cbTeased", "1"); };
  teaser.onclick = () => toggle(true);

  let teaserTimer;
  function scheduleTeaser(ms) {
    clearTimeout(teaserTimer);
    if (store.get("cbTeased")) return;
    teaserTimer = setTimeout(() => { if (!chatOpen && pop.hidden) teaser.hidden = false; }, ms);
  }
  if (!popWanted) scheduleTeaser(12000);

  /* --- messages --- */
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function add(html, who = "bot") {
    const m = document.createElement("div");
    m.className = "cb-msg " + who;
    m.innerHTML = html;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }
  function botSay(parts, next) {
    const list = Array.isArray(parts) ? parts : [parts];
    chips.innerHTML = "";
    let i = 0;
    (function one() {
      const dots = add('<span class="cb-dots"><i></i><i></i><i></i></span>', "bot typing");
      const delay = Math.min(1400, 450 + list[i].replace(/<[^>]+>/g, "").length * 9);
      setTimeout(() => {
        dots.remove(); add(list[i]); i++;
        if (i < list.length) one(); else setChips(next);
      }, delay);
    })();
  }
  function setChips(list = MENU) {
    chips.innerHTML = "";
    list.forEach(c => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "cb-chip"; b.textContent = c.label;
      b.onclick = () => { add(esc(c.label), "me"); c.run(); };
      chips.appendChild(b);
    });
  }

  /* --- live data from the page --- */
  function prices() {
    return $$(".plan").map(p => {
      const name = $("h3", p).textContent, a = $(".amount", p), per = a.dataset.per;
      const base = +a.dataset.price, now = per || !offerOn() ? base : Math.round(base * (1 - OFFER.discount));
      return { name, base, now, per };
    });
  }

  /* --- actions --- */
  const A = {
    book: { label: "📅 Book a free call", run: () => { botSay("Opening Clinton's calendar — pick any time that suits you. 🙌", MENU); setTimeout(window.openCalendly, 900); } },
    wa: { label: "💬 Chat on WhatsApp", run: () => { botSay("Opening WhatsApp so you can message Clinton directly…", MENU); setTimeout(() => window.open(waLink(), "_blank", "noopener"), 900); } },
    msg: { label: "✉️ Leave a message", run: () => startLead() },
    menu: { label: "↩ Main menu", run: () => botSay("What else can I help you with?", MENU) },
  };
  const R = {
    services: () => botSay([
      "Clinton can help with:",
      "• <b>WordPress websites</b> — design & development<br>• <b>Landing pages</b><br>• <b>Elementor builds</b><br>• <b>WooCommerce stores</b><br>• <b>Redesigns</b><br>• <b>Bug fixes, maintenance & migrations</b><br>• <b>Speed & security</b><br>• <b>SEO & digital marketing</b> — Google Business Profile, Klaviyo emails, CRM & automation",
      "Which one are you interested in?",
    ], [ { label: "💲 Pricing", run: R.pricing }, { label: "📈 Digital marketing", run: R.marketing }, { label: "🛠 Fix my site", run: R.fix }, A.book ]),
    pricing: () => {
      const on = offerOn();
      const rows = prices().map(p => `• <b>${p.name}</b> — ${p.per ? `$${p.now}${p.per}` : on ? `<s>$${p.base}</s> <b>$${p.now}</b>` : `from $${p.now}`}`).join("<br>");
      botSay([
        `Here are Clinton's packages${on ? " — with the <b>holiday 20% off</b> already applied 🎉" : ""}:`,
        rows,
        "These are starting prices. You'll get a fixed-scope quote before any work starts, and you can pay in milestones by invoice or through Upwork.",
      ], [ { label: "👀 See full packages", run: () => { goTo("#pricing"); botSay("Scrolled you to the packages 👇", MENU); } }, A.book, A.msg ]);
    },
    offer: () => {
      if (!offerOn()) return botSay("There's no special offer running right now, but you can always book a free consultation call.", [A.book, A.menu]);
      botSay([
        "🎁 <b>Holiday offer:</b> 20% off every website package, plus a <b>free website audit</b> when you book a call.",
        "It ends on <b>31 December</b> — book before then to lock in the discount.",
      ], [ { label: "💲 Show discounted prices", run: R.pricing }, A.book, A.wa ]);
    },
    work: () => botSay([
      "Clinton has worked with <b>50+ clients in 7 countries</b> — medspas, electricians, salons, fitness studios, logistics firms, charities and online stores.",
      "You can scroll through live versions of his projects in the Work section.",
    ], [ { label: "🖼 Show me the work", run: () => { goTo("#work"); botSay("Here you go 👇 Hover a project to scroll through the live site.", MENU); } }, A.book ]),
    process: () => botSay([
      "It's simple: <b>1. Talk</b> → <b>2. Build</b> → <b>3. Polish</b> → <b>4. Launch & support</b>.",
      "Typical timelines: a landing page in about <b>1 week</b>, a business website in <b>2–3 weeks</b>. Bigger builds are scoped per project.",
    ], [ A.book, { label: "💲 Pricing", run: R.pricing }, A.menu ]),
    fix: () => botSay([
      "Clinton fixes broken layouts, mobile issues, slow pages, contact forms that stopped working, plugin conflicts and failed updates — usually fast. 🔧",
      "Tell him what's wrong and share your site link:",
    ], [ A.wa, A.msg, A.book ]),
    marketing: () => botSay([
      "On the marketing side, Clinton offers SEO & local SEO, Google Business Profile setup, Klaviyo email flows, CRM & automation (HubSpot, GoHighLevel, Zoho, Pipedrive, Zapier) and seasonal campaigns & AI video ads. 📈",
    ], [ A.book, A.msg, A.menu ]),
    about: () => botSay("Clinton Nnoshiri is a WordPress developer with <b>5+ years</b> of experience, working remotely with clients worldwide. He studied Theatre Arts — so he designs sites like a stage: clear, engaging, and built to make visitors act. 🎭", [ A.book, { label: "🖼 See his work", run: R.work } ]),
    payment: () => botSay("You get a fixed quote first, then pay in milestones — by invoice, or through <b>Upwork</b> if you'd like payment protection. 🔒", [ { label: "💲 Pricing", run: R.pricing }, A.book ]),
    contact: () => botSay("The fastest ways to reach Clinton:", [ A.wa, A.book, A.msg ]),
    hi: () => botSay("Hey there! 👋 What can I help you with today?", MENU),
    thanks: () => botSay("You're welcome! 😊 Anything else?", MENU),
    unknown: () => botSay([
      "Hmm, I'm not sure about that one — I'm a simple assistant. 🙈",
      "Clinton can answer it personally. Want to message him?",
    ], [ A.wa, A.msg, A.book, A.menu ]),
  };
  const MENU = [
    { label: "🎁 Holiday offer", run: R.offer },
    { label: "🧰 Services", run: R.services },
    { label: "💲 Pricing", run: R.pricing },
    { label: "🖼 See work", run: R.work },
    { label: "🛠 Fix my site", run: R.fix },
    A.book, A.wa,
  ];
  const INTENTS = [
    [/\b(hi|hello|hey|good (morning|afternoon|evening))\b/, R.hi],
    [/thank|thanks|cheers/, R.thanks],
    [/offer|discount|promo|holiday|black ?friday|deal|sale|coupon/, R.offer],
    [/price|pric|cost|how much|budget|rate|charge|fee|cheap|expensive|\$/, R.pricing],
    [/pay|payment|invoice|upwork|milestone|deposit/, R.payment],
    [/seo|google|rank|marketing|email|klaviyo|crm|hubspot|zapier|gohighlevel|ads?\b|campaign/, R.marketing],
    [/fix|bug|broken|break|error|not working|issue|problem|slow|speed|hack|crash|update/, R.fix],
    [/how long|timeline|time|days|weeks|process|steps|start/, R.process],
    [/portfolio|work|project|example|sample|client|experience/, R.work],
    [/who|about|clinton|yourself|location|where|remote/, R.about],
    [/call|meet|book|consult|calendly|zoom|schedule/, () => A.book.run()],
    [/whatsapp|phone|number|contact|reach|email you|talk/, R.contact],
    [/service|offer you|do you do|can you|website|wordpress|elementor|woocommerce|shop|store|landing|redesign|e-?commerce/, R.services],
  ];

  function greet() {
    botSay([
      "Hi! 👋 I'm Clinton's assistant.",
      offerOn() ? "Clinton builds and fixes WordPress websites that bring in customers — and right now there's <b>20% off every package</b> 🎁. What can I help you with?" : "Clinton builds and fixes WordPress websites that bring in customers. What can I help you with?",
    ], MENU);
  }

  /* --- lead capture: name → email → message, sent to Clinton by FormSubmit --- */
  function startLead() { flow = "name"; lead = {}; botSay("Sure! What's your name?", []); }
  async function handleLead(text) {
    if (flow === "name") { lead.name = text; flow = "email"; return botSay(`Nice to meet you, ${esc(text.split(" ")[0])}! What's your email, so Clinton can reply?`, []); }
    if (flow === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return botSay("That email doesn't look quite right — could you check it?", []);
      lead.email = text; flow = "message"; return botSay("Great. What would you like help with? Include your website link if you have one.", []);
    }
    if (flow === "message") {
      lead.message = text; flow = null;
      const wait = add('<span class="cb-dots"><i></i><i></i><i></i></span>', "bot typing");
      try {
        const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.email}`, {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ Name: lead.name, Email: lead.email, Message: lead.message, Source: "Website chat assistant",
            _replyto: lead.email, _subject: `New chat enquiry from ${lead.name}`, _template: "table", _captcha: "false" }),
        });
        const out = await res.json().catch(() => ({}));
        wait.remove();
        if (!res.ok || String(out.success) !== "true") throw 0;
        botSay([`Done! ✅ Clinton will get back to you at <b>${esc(lead.email)}</b> shortly.`, "Want to book a call while you wait?"], [A.book, A.menu]);
      } catch (e) {
        wait.remove();
        botSay("Sorry, I couldn't send that just now. Please reach Clinton on WhatsApp instead:", [A.wa, A.menu]);
      }
    }
  }

  $(".cb-input", root).addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    add(esc(text), "me"); input.value = "";
    if (flow) return handleLead(text);
    const t = text.toLowerCase();
    const hit = INTENTS.find(([re]) => re.test(t));
    (hit ? hit[1] : R.unknown)();
  });
})();
