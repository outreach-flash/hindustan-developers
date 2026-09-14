import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Helper to animate counters from 0 to target value in increments over 0.5s
export function animateCounter(el: HTMLElement) {
  if (el.hasAttribute("data-counter-animated")) return;
  el.setAttribute("data-counter-animated", "true");

  const originalText = el.getAttribute("data-counter-target") || el.textContent?.trim() || "";
  const match = originalText.match(/^([^\d]*)(\d[\d,]*)(.*)$/);
  if (!match) return;

  const prefix = match[1];
  const numStr = match[2].replace(/,/g, "");
  const suffix = match[3];
  const target = parseFloat(numStr);
  if (isNaN(target)) return;

  const hasCommas = match[2].includes(",");
  const obj = { val: 0 };

  // Set initial 0 value
  el.textContent = `${prefix}0${suffix}`;

  gsap.to(obj, {
    val: target,
    duration: 0.5,
    ease: "power1.out",
    onUpdate: () => {
      const current = Math.round(obj.val);
      const formatted = hasCommas ? current.toLocaleString() : current.toString();
      el.textContent = `${prefix}${formatted}${suffix}`;
    },
    onComplete: () => {
      const formatted = hasCommas ? target.toLocaleString() : target.toString();
      el.textContent = `${prefix}${formatted}${suffix}`;
    },
  });
}

function triggerCounters(container: HTMLElement) {
  if (container.hasAttribute("data-counter")) {
    animateCounter(container);
  }
  container.querySelectorAll<HTMLElement>("[data-counter]").forEach(animateCounter);
}

export function initScrollReveals() {
  const allRevealElements = document.querySelectorAll<HTMLElement>(
    "[data-reveal-title], [data-reveal-text], [data-reveal-img], [data-reveal-card], [data-reveal-btn]"
  );

  // Cache initial target text for all counter elements before any animations run
  document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
    if (!el.hasAttribute("data-counter-target")) {
      el.setAttribute("data-counter-target", el.textContent?.trim() || "");
    }
  });

  // Respect user preference for reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    allRevealElements.forEach((el) => {
      el.classList.add("revealed");
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  // Helper to mark element as revealed
  const mark = (el: HTMLElement) => {
    el.classList.add("revealed");
    gsap.set(el, { clearProps: "transform" });
  };

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
            onStart: () => {
              item.classList.add("revealed");
              triggerCounters(item);
            },
            onComplete: () => {
              mark(item);
              triggerCounters(item);
            },
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
            onStart: () => {
              item.classList.add("revealed");
              triggerCounters(item);
            },
            onComplete: () => {
              mark(item);
              triggerCounters(item);
            },
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
            onStart: () => {
              item.classList.add("revealed");
              triggerCounters(item);
            },
            onComplete: () => {
              mark(item);
              triggerCounters(item);
            },
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
            onStart: () => {
              item.classList.add("revealed");
              triggerCounters(item);
            },
            onComplete: () => {
              mark(item);
              triggerCounters(item);
            },
          },
          position
        );
      }
    });
  });

  // 2. Card Grids: [data-reveal-cards]
  const cardGrids = document.querySelectorAll<HTMLElement>("[data-reveal-cards]");
  cardGrids.forEach((grid) => {
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
        stagger: {
          each: 0.12,
          onStart: function () {
            // @ts-ignore
            const target = this.targets()[0] as HTMLElement;
            if (target) {
              target.classList.add("revealed");
              triggerCounters(target);
            }
          },
        },
        ease: "power2.out",
        onComplete: () => {
          cards.forEach((c) => {
            mark(c);
            triggerCounters(c);
          });
        },
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
        onStart: () => {
          title.classList.add("revealed");
          triggerCounters(title);
        },
        onComplete: () => {
          mark(title);
          triggerCounters(title);
        },
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
        onStart: () => {
          text.classList.add("revealed");
          triggerCounters(text);
        },
        onComplete: () => {
          mark(text);
          triggerCounters(text);
        },
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
        onStart: () => img.classList.add("revealed"),
        onComplete: () => mark(img),
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
        onStart: () => {
          card.classList.add("revealed");
          triggerCounters(card);
        },
        onComplete: () => {
          mark(card);
          triggerCounters(card);
        },
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          once: true,
        },
      }
    );
  });

  // 7. Standalone Counters (not inside any reveal group, cards grid, or card)
  document.querySelectorAll<HTMLElement>("[data-counter]").forEach((counter) => {
    if (
      !counter.closest("[data-reveal-group]") &&
      !counter.closest("[data-reveal-cards]") &&
      !counter.closest("[data-reveal-card]")
    ) {
      ScrollTrigger.create({
        trigger: counter,
        start: "top 85%",
        once: true,
        onEnter: () => animateCounter(counter),
      });
    }
  });

  // 8. Refresh ScrollTrigger once DOM and images are completely loaded
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
