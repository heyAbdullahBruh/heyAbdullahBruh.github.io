(() => {
  "use strict";

  if (typeof window.matchMedia !== "function") return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fineHoverPointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  );

  if (reducedMotion.matches || !fineHoverPointer.matches) return;

  const cards = document.querySelectorAll(".social-card[data-tilt]");
  const maxTilt = 4.5;

  cards.forEach((card) => {
    let frameId = 0;

    const reset = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      card.style.setProperty("--rotate-x", "0deg");
      card.style.setProperty("--rotate-y", "0deg");
    };

    const handlePointerMove = (event) => {
      if (reducedMotion.matches) return;
      const bounds = card.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const relativeX = (event.clientX - bounds.left) / bounds.width;
      const relativeY = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (relativeX - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - relativeY) * maxTilt * 2;

      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        card.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
        card.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
      });
    };

    card.addEventListener("pointermove", handlePointerMove, { passive: true });
    card.addEventListener("pointerleave", reset, { passive: true });
    card.addEventListener("blur", reset, true);
  });

  const handleMotionPreferenceChange = (event) => {
    if (!event.matches) return;
    cards.forEach((card) => {
      card.style.setProperty("--rotate-x", "0deg");
      card.style.setProperty("--rotate-y", "0deg");
    });
  };

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionPreferenceChange);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleMotionPreferenceChange);
  }
})();
