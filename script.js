// Navbar background on scroll
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  nav.classList.toggle("menu-open", open);
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("is-open");
    nav.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Rotating role text in hero
const roleEl = document.getElementById("roleRotate");
const roles = ["Data Analyst", "IT & Digital Risk Analyst", "Insight Storyteller", "Problem Solver"];
let roleIdx = 0;
if (roleEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setInterval(() => {
    roleEl.classList.add("is-out");
    setTimeout(() => {
      roleIdx = (roleIdx + 1) % roles.length;
      roleEl.textContent = roles[roleIdx];
      roleEl.classList.remove("is-out");
    }, 350);
  }, 2600);
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();


// Horizontal project scroller arrows
document.querySelectorAll(".subsec").forEach((sub) => {
  const track = sub.querySelector(".scroller");
  const btns = sub.querySelectorAll(".scroller__btn");
  if (!track || !btns.length) return;
  const nav = sub.querySelector(".scroller__nav");
  const update = () => {
    nav.hidden = track.scrollWidth <= track.clientWidth + 4;
    btns[0].disabled = track.scrollLeft <= 4;
    btns[1].disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  btns.forEach((b) =>
    b.addEventListener("click", () => {
      const card = track.querySelector(".project");
      const step = card ? card.offsetWidth + parseFloat(getComputedStyle(track).gap || 0) : track.clientWidth;
      track.scrollBy({ left: step * Number(b.dataset.dir) });
    })
  );
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
});

// Screenshot gallery for private projects
const galleries = document.querySelectorAll("[data-gallery]");
if (galleries.length) {
  const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.innerHTML = `
    <div class="lightbox__top">
      <p class="lightbox__title"></p>
      <button class="lightbox__btn" type="button" data-close aria-label="Close">${icon("M6 6l12 12M18 6L6 18")}</button>
    </div>
    <div class="lightbox__stage">
      <img class="lightbox__img" alt="">
      <button class="lightbox__btn lightbox__nav lightbox__nav--prev" type="button" data-step="-1" aria-label="Previous screenshot">${icon("M15 5l-7 7 7 7")}</button>
      <button class="lightbox__btn lightbox__nav lightbox__nav--next" type="button" data-step="1" aria-label="Next screenshot">${icon("M9 5l7 7-7 7")}</button>
    </div>
    <p class="lightbox__caption"></p>`;
  document.body.appendChild(box);

  const img = box.querySelector(".lightbox__img");
  const title = box.querySelector(".lightbox__title");
  const caption = box.querySelector(".lightbox__caption");
  let shots = [];
  let idx = 0;
  let name = "";
  let opener = null;

  const show = () => {
    const shot = shots[idx];
    img.src = shot.dataset.src;
    img.alt = shot.textContent.trim();
    caption.textContent = shot.textContent.trim();
    title.innerHTML = `${name}<span>${idx + 1} / ${shots.length}</span>`;
  };
  const step = (n) => {
    idx = (idx + n + shots.length) % shots.length;
    show();
  };
  const close = () => {
    box.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    if (opener) opener.focus();
  };

  galleries.forEach((card) => {
    const open = (e) => {
      opener = e.currentTarget;
      shots = [...card.querySelectorAll(".project__shots figure")];
      name = card.querySelector(".project__title").textContent.split(":")[0];
      idx = 0;
      show();
      box.classList.add("is-open");
      document.body.classList.add("lightbox-open");
      box.querySelector("[data-close]").focus();
    };
    card.querySelectorAll(".project__cover--gallery, [data-open-gallery]").forEach((b) => b.addEventListener("click", open));
  });

  box.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn && btn.dataset.step) step(Number(btn.dataset.step));
    else if ((btn && "close" in btn.dataset) || e.target === box || e.target.classList.contains("lightbox__stage")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  let touchX = null;
  box.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touchX = null;
  });
}
