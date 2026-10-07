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
