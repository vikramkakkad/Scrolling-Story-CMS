/* ==========================================================================
   HariOm Sales And Service — script.js (Supabase-powered scrolling story)

   ▶ MANUAL STEP: paste your Supabase project URL and anon public key below.
   Both are safe to expose in client-side code — the anon key only works
   through whatever Row Level Security policies you've set (public SELECT
   only, in our setup), it cannot write or delete anything.
   ========================================================================== */

const SUPABASE_URL = "https://rmiltpuqhbayqidvepnx.supabase.co"; // e.g. https://xxxx.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtaWx0cHVxaGJheXFpZHZlcG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NzYxMDYsImV4cCI6MjEwNjM1MjEwNn0.L7Vi0pIDV2CGHPzt1NJAt5ldc7yjtqU9jh-SQn8L0kw";

/* Each entry: config key to read, icon key, label, and how to build the href.
   Used only for a slide whose type is "contact". */
const CONTACT_ICON_MAP = [
  { key: "whatsapp_number", icon: "whatsapp", label: "WhatsApp", href: v => `https://wa.me/${v.replace(/[^0-9]/g, "")}` },
  { key: "phone_number", icon: "phone", label: "Call", href: v => `tel:${v.replace(/[^0-9+]/g, "")}` },
  { key: "facebook_link", icon: "facebook", label: "Facebook", href: v => v },
  { key: "instagram_link", icon: "instagram", label: "Instagram", href: v => v },
  { key: "google_map_link", icon: "map", label: "Location", href: v => v },
  { key: "email_id", icon: "email", label: "Email", href: v => `mailto:${v}` },
  { key: "youtube_link", icon: "youtube", label: "YouTube", href: v => v },
  { key: "linkedin_link", icon: "linkedin", label: "LinkedIn", href: v => v },
  { key: "twitter_link", icon: "twitter", label: "Twitter", href: v => v },
];

const ICONS = {
  whatsapp: '<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.3-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.5.6.2 1 .4 1.3.5.6.2 1.1.1 1.5.1.5-.1 1.7-.7 1.9-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.5 5.2L2 22l4.9-1.5c1.5.8 3.2 1.3 5.1 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.7 0-3.4-.5-4.8-1.4l-.3-.2-3.1.9.9-3-.2-.3C3.6 14.8 3.1 13 3.1 12c0-4.9 4-8.9 8.9-8.9s8.9 4 8.9 8.9-4 8.9-8.9 8.9z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.6c0-.9.3-1.5 1.6-1.5h1.7V3.2C16.5 3.1 15.5 3 14.4 3c-2.4 0-4 1.5-4 4.1v2.7H7.7v3.2h2.7v8h3.1z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c2.7 0 3 0 4 .1 1 0 1.7.2 2.1.4.5.2.9.5 1.3.9.4.4.6.7.9 1.3.2.4.4 1.1.4 2.1.1 1 .1 1.3.1 4s0 3-.1 4c0 1-.2 1.7-.4 2.1-.2.5-.5.9-.9 1.3-.4.4-.7.6-1.3.9-.4.2-1.1.4-2.1.4-1 .1-1.3.1-4 .1s-3 0-4-.1c-1 0-1.7-.2-2.1-.4-.5-.2-.9-.5-1.3-.9-.4-.4-.6-.7-.9-1.3-.2-.4-.4-1.1-.4-2.1-.1-1-.1-1.3-.1-4s0-3 .1-4c0-1 .2-1.7.4-2.1.2-.5.5-.9.9-1.3.4-.4.7-.6 1.3-.9.4-.2 1.1-.4 2.1-.4 1-.1 1.3-.1 4-.1zM12 0C9.3 0 8.9 0 7.9.1c-1.1.1-1.9.2-2.5.5-.7.3-1.3.6-1.8 1.2-.6.6-.9 1.2-1.2 1.8-.2.6-.4 1.4-.5 2.5C1.9 7.1 1.9 7.5 1.9 12s0 4.9.1 5.9c.1 1.1.2 1.9.5 2.5.3.7.6 1.3 1.2 1.8.6.6 1.2.9 1.8 1.2.6.2 1.4.4 2.5.5 1 .1 1.4.1 4.1.1s3.1 0 4.1-.1c1.1-.1 1.9-.2 2.5-.5.7-.3 1.3-.6 1.8-1.2.6-.6.9-1.2 1.2-1.8.2-.6.4-1.4.5-2.5.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c-.1-1.1-.2-1.9-.5-2.5-.3-.7-.6-1.3-1.2-1.8-.6-.6-1.2-.9-1.8-1.2-.6-.2-1.4-.4-2.5-.5C15.1 0 14.7 0 12 0z"/><path d="M12 5.8A6.2 6.2 0 1 0 12 18.2 6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/><circle cx="18.4" cy="5.6" r="1.4"/></svg>',
  email: '<svg viewBox="0 0 24 24"><path d="M3 5.5h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1zm1.6 1.6L12 12.4l7.4-5.3H4.6zM4 8.9V17h16V8.9l-8 5.7-8-5.7z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.6h.1c.5-1 1.9-2 3.9-2 4.2 0 5 2.8 5 6.3V21h-4v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24"><path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.6.8-2.6 1a4 4 0 0 0-6.9 3.7A11.4 11.4 0 0 1 3.7 4.6a4.1 4.1 0 0 0 1.2 5.4c-.6 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.6 3.2 4a4 4 0 0 1-1.8.1c.5 1.6 2 2.8 3.8 2.8A8 8 0 0 1 2 18.4a11.3 11.3 0 0 0 6.2 1.8c7.4 0 11.5-6.2 11.5-11.5v-.5c.8-.6 1.5-1.3 2-2.1l.3-.2z"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.6c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8z"/></svg>',
  map: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24"><path d="M22 12s0-3.1-.4-4.6a2.8 2.8 0 0 0-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2C2 8.9 2 12 2 12s0 3.1.4 4.6a2.8 2.8 0 0 0 2 2C6.1 19 12 19 12 19s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2C22 15.1 22 12 22 12zM10 15.5v-7l6 3.5-6 3.5z"/></svg>',
};

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

/* ==========================================================================
   Photo "look" — display mode, scale, positions, smart caption.
   ⚠ This block is IDENTICAL in script.js (public site) and story-builder.html
   (live preview). If you change one, change the other.
   Everything is stored as percentages / directions (never pixels), so it fits
   any phone shape. "Is the caption outside the photo?" is MEASURED on the real
   screen, not assumed from a fixed canvas size.
   ========================================================================== */
const LOOK_DEFAULT = { mode: "cover", scale: 100, imgPos: "center", capPos: "bottom", shadow: 4, textColor: "white", shadowColor: "black" };

function normalizeLook(raw) {
  const l = { ...LOOK_DEFAULT, ...(raw || {}) };
  if (!["cover", "blur", "solid"].includes(l.mode)) l.mode = "cover";
  const sc = Number(l.scale);
  l.scale = Math.min(100, Math.max(60, Number.isFinite(sc) ? sc : 100));
  if (!["top", "center", "bottom"].includes(l.imgPos)) l.imgPos = "center";
  if (!["top", "center", "bottom"].includes(l.capPos)) l.capPos = "bottom";
  const sh = Number(l.shadow);
  l.shadow = Math.min(10, Math.max(0, Number.isFinite(sh) ? sh : 4));
  l.textColor = l.textColor === "black" ? "black" : "white";
  l.shadowColor = l.shadowColor === "white" ? "white" : "black";
  return l;
}

/* Where the photo is actually drawn inside a frame of W×H (px), for a photo of
   natural size nw×nh. Cover = whole frame. Blur/Solid = "contain" inside a box
   that is scale% of the frame, anchored top / center / bottom. */
function computeImageRect(W, H, nw, nh, look) {
  if (look.mode === "cover" || !nw || !nh) return { x: 0, y: 0, w: W, h: H };
  const s = look.scale / 100;
  const bw = W * s, bh = H * s;
  const r = nw / nh;
  let w, h;
  if (bw / bh > r) { h = bh; w = h * r; } else { w = bw; h = w / r; }
  const x = (W - w) / 2;
  const y = look.imgPos === "top" ? 0 : look.imgPos === "bottom" ? H - h : (H - h) / 2;
  return { x, y, w, h };
}

/* Share (0..1) of rectangle a that lies inside rectangle b. */
function overlapFraction(a, b) {
  const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  return a.w * a.h ? (ix * iy) / (a.w * a.h) : 1;
}

function lookTextShadow(look) {
  const b = look.shadow;
  if (!b) return "none";
  const c = look.shadowColor === "white" ? "#fff" : "#000";
  return `0 0 ${b}px ${c}, 0 0 ${b * 2}px ${c}, 0 1px ${Math.max(1, b / 2)}px ${c}`;
}

/* Smart caption: measure the real caption box against the real photo rectangle.
   If the caption sits (mostly) outside the photo, add .cap-outside — CSS then
   forces white text + black shadow (Solution A) and a semi-transparent pill
   (Solution B). Returns true when the caption is outside. */
function layoutLookSlide(el, look) {
  const img = el.querySelector(".look-img");
  const cap = el.querySelector(".look-caption");
  const fr = el.getBoundingClientRect();
  if (!img || !cap || !fr.width || !fr.height) return false;
  const imgRect = computeImageRect(fr.width, fr.height, img.naturalWidth, img.naturalHeight, look);
  cap.classList.remove("cap-outside");               // measure WITHOUT the pill
  const cr = cap.getBoundingClientRect();
  const capRect = { x: cr.left - fr.left, y: cr.top - fr.top, w: cr.width, h: cr.height };
  const outside = look.mode !== "cover" && overlapFraction(capRect, imgRect) < 0.5;
  cap.classList.toggle("cap-outside", outside);
  return outside;
}

function renderLookSlide(el, slide, onLayout) {
  const look = normalizeLook(slide.look);
  const src = slide.media_url;
  const alt = escapeHTML(slide.alt_text || slide.caption || "");
  const metaBits = [];
  if (slide.actor_name) metaBits.push(`👤 ${escapeHTML(slide.actor_name)}`);
  if (slide.image_source) metaBits.push(`📷 ${escapeHTML(slide.image_source)}`);

  el.classList.add("look-slide");
  el.dataset.lookmode = look.mode;
  el.innerHTML = `
    <div class="look-bg">${look.mode === "blur" ? `<img src="${src}" alt="" loading="lazy">` : ""}</div>
    <div class="look-fg ip-${look.imgPos}" style="--s:${look.scale / 100}">
      <img class="look-img" src="${src}" alt="${alt}" loading="lazy">
    </div>
    ${(slide.caption || metaBits.length) ? `<div class="look-caption cp-${look.capPos}">
      ${slide.caption ? `<span class="cap-text">${escapeHTML(slide.caption)}</span>` : ""}
      ${metaBits.length ? `<span class="cap-meta">${metaBits.join(" &nbsp;·&nbsp; ")}</span>` : ""}
    </div>` : ""}`;

  const cap = el.querySelector(".look-caption");
  if (cap) {
    cap.style.color = look.textColor === "black" ? "#000" : "#fff";
    cap.style.textShadow = lookTextShadow(look);
  }

  const run = () => { const out = layoutLookSlide(el, look); if (onLayout) onLayout(out); };
  el.querySelector(".look-img").addEventListener("load", run);
  if (el._lookRO) el._lookRO.disconnect();
  if (typeof ResizeObserver !== "undefined") { el._lookRO = new ResizeObserver(run); el._lookRO.observe(el); }
  else window.addEventListener("resize", run);
  run();
}

/* --------------------------------------------------------------------------
   Supabase REST helper — plain fetch, no SDK needed for simple reads.
   -------------------------------------------------------------------------- */
async function supaSelect(table, query = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase fetch failed for "${table}": HTTP ${res.status}`);
  return res.json();
}

/* ==========================================================================
   Render
   ========================================================================== */
function renderContactIcons(config) {
  const items = CONTACT_ICON_MAP
    .filter(item => config[item.key])
    .map(item => {
      const value = config[item.key];
      return `<a class="contact-icon-link" href="${item.href(value)}" target="_blank" rel="noopener">
                ${ICONS[item.icon]}<span>${item.label}</span>
              </a>`;
    })
    .join("");
  return `<div class="contact-icons">${items}</div>`;
}

function buildSlideEl(slide, config) {
  const el = document.createElement("section");
  el.className = "slide";
  el.dataset.type = slide.type;

  if (slide.type === "video") {
    if (slide.duration_override) el.dataset.videoDuration = slide.duration_override;
    el.innerHTML = `
      <video class="slide-media" src="${slide.media_url}" muted playsinline preload="metadata"></video>
      <button class="mute-toggle" aria-label="Sound on/off">🔇</button>
      ${slide.caption ? `<div class="slide-overlay"><p class="slide-caption">${escapeHTML(slide.caption)}</p></div>` : ""}
    `;
    const video = el.querySelector("video");
    const muteBtn = el.querySelector(".mute-toggle");
    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? "🔇" : "🔊";
    });
  } else if (slide.type === "contact") {
    el.innerHTML = `
      <div class="contact-slide">
        <h2>${escapeHTML(config.shop_title || config.name || "Contact Us")}</h2>
        ${renderContactIcons(config)}
      </div>
    `;
  } else if (slide.type === "testimonial") {
    el.innerHTML = `
      <div class="testimonial-slide">
        ${slide.photo_url ? `<img class="testimonial-photo" src="${slide.photo_url}" alt="">` : ""}
        <p class="testimonial-text">“${escapeHTML(slide.text)}”</p>
        <p class="testimonial-name">— ${escapeHTML(slide.customer_name || "ગ્રાહક")}</p>
      </div>
    `;
  } else if (slide.look) {
    // photo with a saved "look" (display mode / scale / positions / smart caption)
    renderLookSlide(el, slide);
  } else {
    // default: image
    const metaBits = [];
    if (slide.actor_name) metaBits.push(`👤 ${escapeHTML(slide.actor_name)}`);
    if (slide.image_source) metaBits.push(`📷 ${escapeHTML(slide.image_source)}`);
    const metaLine = metaBits.length ? `<p class="slide-meta-line">${metaBits.join(" &nbsp;·&nbsp; ")}</p>` : "";

    el.innerHTML = `
      <img class="slide-media" src="${slide.media_url}" alt="${escapeHTML(slide.alt_text || slide.caption || "")}" loading="lazy">
      ${(slide.caption || metaLine) ? `<div class="slide-overlay">
        ${slide.caption ? `<p class="slide-caption">${escapeHTML(slide.caption)}</p>` : ""}
        ${metaLine}
      </div>` : ""}
    `;
  }

  return el;
}

function renderDots(count) {
  const dotsNav = document.getElementById("dots");
  dotsNav.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const d = document.createElement("div");
    d.className = "dot" + (i === 0 ? " is-active" : "");
    dotsNav.appendChild(d);
  }
}

/* Plays the video in the slide currently filling most of the screen, pauses
   all others — and keeps the side dots in sync with scroll position.
   Returns a small state object so other code (the auto-scroll timer) always
   knows which slide is actually on screen right now. */
function wireViewportBehavior(container, slideEls) {
  const dots = document.querySelectorAll(".dot");
  const state = { currentIndex: 0 };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = slideEls.indexOf(entry.target);
        const video = entry.target.querySelector("video");

        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          state.currentIndex = index;
          if (dots[index]) {
            dots.forEach(d => d.classList.remove("is-active"));
            dots[index].classList.add("is-active");
          }
          if (video) {
            video.currentTime = 0;
            video.play().catch(() => {});
          }
        } else if (video) {
          video.pause();
        }
      });
    },
    { root: container, threshold: [0, 0.6, 1] }
  );

  slideEls.forEach(el => observer.observe(el));
  return state;
}

/* ==========================================================================
   Auto-scroll — moves to the next slide every 2.5s on its own.
   - Pauses for a few seconds the moment the person scrolls by hand (wheel /
     touch), so it never fights a manual swipe.
   - On a video slide, it waits for that video to actually finish playing
     before moving on, instead of cutting it off mid-way.
   ========================================================================== */
function startAutoScroll(container, slideEls, viewportState) {
  const INTERVAL_MS = 2500;
  const MANUAL_PAUSE_MS = 4000;
  let pausedUntil = 0;

  const pauseAutoScroll = () => { pausedUntil = Date.now() + MANUAL_PAUSE_MS; };
  // wheel/touchmove only fire on direct user input — unlike "scroll", they
  // are never triggered by our own scrollIntoView() call below, so this
  // can't create a feedback loop that pauses the timer forever.
  container.addEventListener("wheel", pauseAutoScroll, { passive: true });
  container.addEventListener("touchmove", pauseAutoScroll, { passive: true });

  setInterval(() => {
    if (Date.now() < pausedUntil) return;

    const currentEl = slideEls[viewportState.currentIndex];
    const video = currentEl && currentEl.querySelector("video");
    if (video && !video.paused && !video.ended) {
      // a per-slide override (e.g. "only play 20s of this clip") lets a
      // long source file still advance on schedule in the story; with no
      // override, behavior is unchanged — wait for the video to finish.
      const override = currentEl.dataset.videoDuration ? Number(currentEl.dataset.videoDuration) : null;
      if (!override || video.currentTime < override) return;
    }

    const nextIndex = (viewportState.currentIndex + 1) % slideEls.length;
    slideEls[nextIndex].scrollIntoView({ behavior: "smooth" });
  }, INTERVAL_MS);
}

/* ==========================================================================
   Two loading modes:
   - Legacy/default: the original single always-on-site_config site (no
     story id anywhere) — unchanged behavior, for backward compatibility.
   - Story mode: a specific saved story (built in Story Builder), picked via
     window.FIXED_STORY_ID (baked into an exported per-entity file) or a
     ?story=<id> URL parameter (for quick live links straight from Supabase).
   ========================================================================== */

async function loadLegacyDefault() {
  const [configRows, slideRows] = await Promise.all([
    supaSelect("site_config", "select=*"),
    supaSelect("slides", "select=*&order=order_index.asc"),
  ]);
  const config = {};
  configRows.forEach(r => { config[r.key] = r.value; });
  return { brandName: config.shop_title || "HariOm Sales And Service", slides: slideRows, slideConfig: config };
}

async function loadStoryById(storyId) {
  const storyRows = await supaSelect("stories", `select=*&id=eq.${storyId}`);
  const story = storyRows[0];
  if (!story) throw new Error("Story not found: " + storyId);

  let mediaSlides = [];
  const slideConfigs = story.slide_configs || [];
  if (slideConfigs.length > 0) {
    const ids = slideConfigs.map(c => c.id);
    const uploadRows = await supaSelect("uploads", `select=*&id=in.(${ids.join(",")})`);
    const byId = {};
    uploadRows.forEach(u => { byId[u.id] = u; });
    mediaSlides = slideConfigs
      .map(c => {
        const u = byId[c.id];
        if (!u) return null;
        const out = c.duration ? { ...u, duration_override: c.duration } : { ...u };
        if (c.look) out.look = c.look;
        return out;
      })
      .filter(Boolean);
  }

  let entity = null;
  if (story.entity_id) {
    const entRows = await supaSelect("entities", `select=*&id=eq.${story.entity_id}`);
    entity = entRows[0] || null;
  }

  let testimonialSlides = [];
  if (story.testimonial_ids && story.testimonial_ids.length > 0) {
    const tRows = await supaSelect("testimonials", `select=*&id=in.(${story.testimonial_ids.join(",")})`);
    testimonialSlides = tRows.map(t => ({ type: "testimonial", text: t.text, customer_name: t.customer_name, photo_url: t.photo_url }));
  }

  const slides = [...mediaSlides, ...testimonialSlides];
  if (story.include_social && entity) slides.push({ type: "contact" });

  return {
    brandName: (entity && entity.name) || story.title || "Story",
    slides,
    slideConfig: entity || {},
  };
}

/* ==========================================================================
   Init
   ========================================================================== */
async function init() {
  const scrollEl = document.getElementById("storyScroll");
  try {
    const storyId = window.FIXED_STORY_ID || new URLSearchParams(location.search).get("story");
    const data = storyId ? await loadStoryById(storyId) : await loadLegacyDefault();

    document.getElementById("brandName").textContent = data.brandName;

    scrollEl.innerHTML = "";
    const slideEls = data.slides.map(slide => {
      const el = buildSlideEl(slide, data.slideConfig);
      scrollEl.appendChild(el);
      return el;
    });

    if (slideEls.length === 0) {
      scrollEl.innerHTML = `<div class="loading">આ સ્ટોરીમાં કોઈ સ્લાઈડ નથી.</div>`;
      return;
    }

    renderDots(slideEls.length);
    const viewportState = wireViewportBehavior(scrollEl, slideEls);
    startAutoScroll(scrollEl, slideEls, viewportState);
  } catch (err) {
    console.error(err);
    scrollEl.innerHTML = `<div class="loading">લોડ કરવામાં તકલીફ — ઈન્ટરનેટ ચેક કરો અથવા ફરી પ્રયત્ન કરો</div>`;
  }
}

init();
