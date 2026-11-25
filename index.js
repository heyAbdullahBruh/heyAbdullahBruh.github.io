(() => {
  "use strict";
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)");

  // Reveal content only when motion is allowed; keep all content visible without JS.
  const revealItems = document.querySelectorAll(".reveal");
  if (!reducedMotion?.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((element) => observer.observe(element));
  } else {
    revealItems.forEach((element) => element.classList.add("is-visible"));
  }

  // Gentle tilt on the hero illustration for fine-pointer devices only.
  const visual = document.querySelector(".hero-visual[data-tilt]");
  if (!visual || reducedMotion?.matches || !finePointer?.matches) return;
  let frame = 0;
  const reset = () => {
    if (frame) cancelAnimationFrame(frame);
    visual.style.setProperty("--rx", "0deg");
    visual.style.setProperty("--ry", "0deg");
  };
  visual.addEventListener("pointermove", (event) => {
    const rect = visual.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      visual.style.setProperty("--rx", `${(-y * 3.2).toFixed(2)}deg`);
      visual.style.setProperty("--ry", `${(x * 3.2).toFixed(2)}deg`);
    });
  }, { passive: true });
  visual.addEventListener("pointerleave", reset, { passive: true });
  window.addEventListener("blur", reset, { passive: true });
})();
