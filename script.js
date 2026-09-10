/* Lauhith Natarajan — personal site
   Small, dependency-free enhancements. Everything works without this file. */
(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsObserver = "IntersectionObserver" in window;

  /* Header hairline appears once the page has scrolled. */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Reveal content as it enters the viewport. */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !supportsObserver) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* Mark the section currently in view in the nav. */
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && supportsObserver) {
    const setCurrent = (id) => {
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${id}`) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };
    const so = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((section) => so.observe(section));
  }

  /* Annotated figures: hovering or focusing a marker highlights its note,
     hovering a note highlights its marker. Tapping a marker also scrolls
     the note into view for touch screens. */
  document.querySelectorAll(".case").forEach((caseEl) => {
    const marks = Array.from(caseEl.querySelectorAll(".mark"));
    const notes = Array.from(caseEl.querySelectorAll(".notes li"));

    const setActive = (index, on) => {
      marks[index]?.classList.toggle("is-active", on);
      notes[index]?.classList.toggle("is-active", on);
    };
    const clearAll = () => marks.forEach((_, i) => setActive(i, false));

    marks.forEach((mark, i) => {
      mark.addEventListener("mouseenter", () => setActive(i, true));
      mark.addEventListener("mouseleave", () => setActive(i, false));
      mark.addEventListener("focus", () => setActive(i, true));
      mark.addEventListener("blur", () => setActive(i, false));
      mark.addEventListener("click", () => {
        clearAll();
        setActive(i, true);
        const note = notes[i];
        if (!note) return;
        const rect = note.getBoundingClientRect();
        const visible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (!visible) {
          note.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
        }
      });
    });

    notes.forEach((note, i) => {
      note.addEventListener("mouseenter", () => setActive(i, true));
      note.addEventListener("mouseleave", () => setActive(i, false));
    });
  });

  /* Footer year. */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
