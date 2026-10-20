/* =========================================================
   Red Bull landing page — vanilla JavaScript
   ========================================================= */

/* ---------- 1. Single source of truth for product data ---------- */
const products = {
  original: {
    name: "Red Bull Original",
    theme: "theme-original",
    image: "assets/redbull-original.png",
    alt: "Red Bull Original can in blue and silver",
    headline: "Gives You Wings.",
    description: "Discover the energy, refreshment, and unmistakable character of Red Bull.",
    formula: "The classic formula, sweetened with sugars.",
    sweetTitle: "Sugars",
    sweetText: "Sucrose and glucose give the classic taste.",
    taste: "Crisp, sparkling and distinctive — the taste that started it all.",
    tags: ["Crisp", "Sparkling", "Iconic", "Refreshing"],
  },
  sugarfree: {
    name: "Red Bull Sugarfree",
    theme: "theme-sugarfree",
    image: "assets/redbull-sugarfree.png",
    alt: "Red Bull Sugarfree can in gray and silver",
    headline: "Wings. No Sugar.",
    description: "The sugar-free Red Bull variant — sweetened without sugar, still built for energy.",
    formula: "A sugar-free formulation using sweeteners instead of sugars.",
    sweetTitle: "Sugar-free",
    sweetText: "Sweeteners (such as aspartame and acesulfame K) replace sugar.",
    taste: "Clean, light and minimal — familiar character with a lighter finish.",
    tags: ["Clean", "Light", "Minimal", "Sugar-free"],
  },
  red: {
    name: "Red Bull Red Edition",
    theme: "theme-red",
    image: "assets/redbull-red-edition.png",
    alt: "Red Bull Red Edition can in red and silver",
    headline: "Bold. Red. Wings.",
    description: "Discover a bold, red-themed Red Bull Edition with a fruity twist.",
    formula: "Edition formula with sugars and fruit-inspired flavoring.",
    sweetTitle: "Sugars",
    sweetText: "Sugars combined with a fruity flavor profile.",
    taste: "Bold and fruity — an intense, red-fruit inspired experience.",
    tags: ["Bold", "Fruity", "Intense", "Vibrant"],
  },
};

/* Sample reviews — clearly placeholder content */
const reviews = [
  { flavor: "original", stars: 5, text: "The classic. My go-to before a long study session.", by: "Sample reviewer A" },
  { flavor: "sugarfree", stars: 4, text: "Lighter taste, still does the job on gym days.", by: "Sample reviewer B" },
  { flavor: "red", stars: 5, text: "The fruity edge is great — love the bold vibe.", by: "Sample reviewer C" },
  { flavor: "original", stars: 4, text: "Ice cold, it's hard to beat on road trips.", by: "Sample reviewer D" },
  { flavor: "red", stars: 4, text: "Different from the original in a good way.", by: "Sample reviewer E" },
  { flavor: "sugarfree", stars: 5, text: "Clean finish, exactly what I wanted.", by: "Sample reviewer F" },
];

const body = document.body;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let current = "original";

/* ---------- 2. Theme switching ---------- */
function setFlavor(key) {
  if (!products[key] || key === current) return;
  const p = products[key];
  current = key;

  // Swap the theme class on <body>; CSS variables handle the rest.
  Object.values(products).forEach((x) => body.classList.remove(x.theme));
  body.classList.add(p.theme);

  // Update text fields (any element with data-field="...")
  document.querySelectorAll("[data-field]").forEach((el) => {
    const field = el.dataset.field === "label" ? "name" : el.dataset.field;
    if (p[field] === undefined) return;
    el.textContent = p[field];
    el.classList.remove("swap-text");
    void el.offsetWidth; // restart animation
    el.classList.add("swap-text");
  });

  swapCan(p);
  document.getElementById("tasteCan").src = p.image;
  renderTags(p.tags);
  highlightIngredient(key);
  updateSelectors(key);

  // Contact form follows the current flavor by default
  document.getElementById("flavor").value = key;
}

function swapCan(p) {
  const can = document.getElementById("heroCan");
  if (reduceMotion) { can.src = p.image; can.alt = p.alt; return; }
  can.classList.remove("is-entering");
  can.classList.add("is-leaving");
  setTimeout(() => {
    can.src = p.image;
    can.alt = p.alt;
    can.classList.remove("is-leaving");
    void can.offsetWidth;
    can.classList.add("is-entering");
  }, 320);
}

function renderTags(tags) {
  document.getElementById("tasteTags").innerHTML = tags.map((t) => `<li>${t}</li>`).join("");
}

function highlightIngredient(key) {
  document.querySelectorAll(".ingredient").forEach((c) => c.classList.remove("is-highlight"));
  const target = key === "original" ? "caffeine" : key === "sugarfree" ? "sweet" : "sweet";
  document.querySelector(`.ingredient[data-ing="${target}"]`).classList.add("is-highlight");
}

function updateSelectors(key) {
  document.querySelectorAll(".selector__btn").forEach((b) => {
    const on = b.dataset.flavor === key;
    b.setAttribute("aria-checked", on);
    b.tabIndex = on ? 0 : -1;
  });
  document.querySelectorAll(".taste__switch .chip").forEach((b) => {
    const on = b.dataset.flavor === key;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on);
  });
}

// Click handlers for hero selector + taste chips
document.querySelectorAll("[data-flavor]").forEach((btn) =>
  btn.addEventListener("click", () => setFlavor(btn.dataset.flavor))
);

// Arrow-key navigation inside the radiogroup
document.querySelector(".selector").addEventListener("keydown", (e) => {
  const keys = Object.keys(products);
  let i = keys.indexOf(current);
  if (e.key === "ArrowRight" || e.key === "ArrowDown") i = (i + 1) % keys.length;
  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = (i - 1 + keys.length) % keys.length;
  else return;
  e.preventDefault();
  setFlavor(keys[i]);
  document.querySelector(`.selector__btn[data-flavor="${keys[i]}"]`).focus();
});

/* ---------- 3. Navigation ---------- */
const nav = document.getElementById("nav");
const toggle = document.getElementById("navToggle");
const menu = document.getElementById("navMenu");

function closeMenu() {
  menu.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open menu");
}
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 30);
  // light parallax on the taste can
  if (!reduceMotion) {
    const tc = document.getElementById("tasteCan");
    const r = tc.getBoundingClientRect();
    const offset = (r.top - window.innerHeight / 2) * -0.06;
    tc.style.transform = `rotate(-12deg) translateY(${offset}px)`;
  }
}, { passive: true });

// Active nav link based on visible section
const links = document.querySelectorAll(".nav__link");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${en.target.id}`));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

/* ---------- 4. Scroll reveal ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-visible"); revealObserver.unobserve(en.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- 5. Particles ---------- */
if (!reduceMotion) {
  const box = document.getElementById("particles");
  for (let i = 0; i < 28; i++) {
    const s = document.createElement("span");
    s.className = "particle";
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDuration = 8 + Math.random() * 10 + "s";
    s.style.animationDelay = -Math.random() * 15 + "s";
    const size = 2 + Math.random() * 4;
    s.style.width = s.style.height = size + "px";
    box.appendChild(s);
  }
}

/* ---------- 6. Reviews + filter ---------- */
const reviewGrid = document.getElementById("reviewGrid");
reviewGrid.innerHTML = reviews.map((r) => `
  <article class="card review reveal is-visible" data-flavor-tag="${r.flavor}">
    <div class="stars" aria-label="${r.stars} out of 5 stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
    <p>${r.text}</p>
    <footer><span>${r.by}</span><span class="tag">${products[r.flavor].name.replace("Red Bull ", "")}</span></footer>
  </article>`).join("");

document.querySelectorAll("[data-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-pressed", b === btn);
    });
    reviewGrid.querySelectorAll(".review").forEach((card) => {
      card.classList.toggle("is-hidden", f !== "all" && card.dataset.flavorTag !== f);
    });
  });
});

/* ---------- 7. Contact form validation (demo only) ---------- */
const form = document.getElementById("contactForm");
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateField(input) {
  const v = input.value.trim();
  let msg = "";
  if (input.required && !v) msg = "This field is required.";
  else if (input.type === "email" && !emailRe.test(v)) msg = "Please enter a valid email address.";
  else if (input.id === "message" && v.length < 10) msg = "Message should be at least 10 characters.";
  const err = document.getElementById(`${input.id}-error`);
  if (err) err.textContent = msg;
  input.closest(".field").classList.toggle("has-error", !!msg);
  input.setAttribute("aria-invalid", !!msg);
  if (msg) input.setAttribute("aria-describedby", `${input.id}-error`);
  return !msg;
}

form.querySelectorAll("input, textarea").forEach((el) =>
  el.addEventListener("blur", () => validateField(el))
);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = [...form.querySelectorAll("input[required], textarea[required]")];
  const valid = fields.map(validateField).every(Boolean);
  const status = document.getElementById("formStatus");
  if (!valid) { status.textContent = ""; fields.find((f) => f.getAttribute("aria-invalid") === "true").focus(); return; }

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.textContent = "Sending…";
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = "Send message";
    status.textContent = "✓ Demo submission successful — nothing was actually sent.";
    form.reset();
    document.getElementById("flavor").value = current;
  }, 1200);
});

/* ---------- Init ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
renderTags(products.original.tags);
highlightIngredient("original");
updateSelectors("original");
