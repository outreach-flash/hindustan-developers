import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollReveals() {
  // Respect user preference for reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("[data-reveal-title], [data-reveal-text], [data-reveal-img], [data-reveal-card]").forEach((el) => {
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "none";
    });
    return;
  }

  // 1. Grouped Reveals: elements inside [data-reveal-group] trigger together in a staggered sequence
  const groups = document.querySelectorAll<HTMLElement>("[data-reveal-group]");
  groups.forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>(
      "[data-reveal-title], [data-reveal-text], [data-reveal-card], [data-reveal-img], [data-reveal-btn]"
    );
    if (!items.length) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: group,
        start: "top 85%",
        once: true,
      },
    });

    items.forEach((item, index) => {
      const position = index === 0 ? 0 : "<+=0.1";

      if (item.hasAttribute("data-reveal-img")) {
        tl.fromTo(
          item,
          { opacity: 0, scale: 1.18 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.15,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          position
        );
      } else if (item.hasAttribute("data-reveal-title")) {
        tl.fromTo(
          item,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
          position
        );
      } else if (item.hasAttribute("data-reveal-card")) {
        tl.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          position
        );
      } else {
        // default text / badge / button
        tl.fromTo(
          item,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          position
        );
      }
    });
  });

  // 2. Card Grids: [data-reveal-cards]
  const cardGrids = document.querySelectorAll<HTMLElement>("[data-reveal-cards]");
  cardGrids.forEach((grid) => {
    // If inside an already handled reveal group, skip
    if (grid.closest("[data-reveal-group]")) return;

    const cards = grid.querySelectorAll<HTMLElement>("[data-reveal-card]");
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          once: true,
        },
      }
    );
  });

  // 3. Standalone Titles (not inside a group)
  const standaloneTitles = document.querySelectorAll<HTMLElement>("[data-reveal-title]");
  standaloneTitles.forEach((title) => {
    if (title.closest("[data-reveal-group]")) return;

    gsap.fromTo(
      title,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          once: true,
        },
      }
    );
  });

  // 4. Standalone Text / Subtitles (not inside a group)
  const standaloneText = document.querySelectorAll<HTMLElement>("[data-reveal-text]");
  standaloneText.forEach((text) => {
    if (text.closest("[data-reveal-group]")) return;

    gsap.fromTo(
      text,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: text,
          start: "top 85%",
          once: true,
        },
      }
    );
  });

  // 5. Standalone Images (not inside a group)
  const standaloneImgs = document.querySelectorAll<HTMLElement>("[data-reveal-img]");
  standaloneImgs.forEach((img) => {
    if (img.closest("[data-reveal-group]")) return;

    const triggerElement = img.parentElement || img;

    gsap.fromTo(
      img,
      { opacity: 0, scale: 1.18 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: triggerElement,
          start: "top 85%",
          once: true,
        },
      }
    );
  });

  // 6. Standalone Cards (not inside a group or card grid)
  const standaloneCards = document.querySelectorAll<HTMLElement>("[data-reveal-card]");
  standaloneCards.forEach((card) => {
    if (card.closest("[data-reveal-group]") || card.closest("[data-reveal-cards]")) return;

    gsap.fromTo(
      card,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          once: true,
        },
      }
    );
  });

  // 7. Refresh ScrollTrigger when images load to guarantee accurate trigger calculations
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
}

// Auto-run when loaded in the browser
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initScrollReveals());
  } else {
    initScrollReveals();
  }
}
