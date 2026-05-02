"use strict";

/* Reveal animation */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("active"));
}

/* Premium card tilt effect */
const tiltArea = document.getElementById("tiltArea");
const card = tiltArea?.querySelector(".premium-card");

if (tiltArea && card) {
  tiltArea.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 768) return;

    const rect = tiltArea.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 16;
    const rotateX = (0.5 - y / rect.height) * 16;

    card.style.animation = "none";
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  tiltArea.addEventListener("mouseleave", () => {
    card.style.animation = "";
    card.style.transform = "";
  });
}

/* Desktop mouse glow */
const cursorGlow = document.getElementById("cursorGlow");

if (cursorGlow) {
  window.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 768) return;

    cursorGlow.style.opacity = "1";
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });

  window.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
  });

  window.addEventListener("mousedown", () => {
    if (window.innerWidth <= 768) return;
    cursorGlow.classList.add("clicking");
  });

  window.addEventListener("mouseup", () => {
    cursorGlow.classList.remove("clicking");
  });
}

/* Mobile touch glow */
const mobileSpark = document.getElementById("mobileSpark");

if (mobileSpark) {
  window.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];
      if (!touch) return;

      mobileSpark.style.left = `${touch.clientX}px`;
      mobileSpark.style.top = `${touch.clientY}px`;

      mobileSpark.classList.remove("active");
      void mobileSpark.offsetWidth;
      mobileSpark.classList.add("active");
    },
    { passive: true }
  );
}

/* Mobile drag + scroll parallax effect */
const dragLayer = document.getElementById("dragLayer");
const dragItems = dragLayer ? dragLayer.querySelectorAll("span") : [];

let touchStartY = 0;
let lastScrollY = window.scrollY;
let resetTimer = null;

function resetDragItems() {
  dragItems.forEach((item) => {
    item.style.transform = "translate3d(0, 0, 0)";
  });
}

if (dragItems.length) {
  window.addEventListener(
    "touchstart",
    (event) => {
      if (window.innerWidth > 768) return;

      const touch = event.touches[0];
      if (!touch) return;

      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (window.innerWidth > 768) return;

      const touch = event.touches[0];
      if (!touch) return;

      const moveY = touch.clientY - touchStartY;

      dragItems.forEach((item, index) => {
        const speed = (index + 1) * 0.12;
        item.style.transform = `translate3d(0, ${moveY * speed}px, 0)`;
      });
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    () => {
      resetDragItems();
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    () => {
      if (window.innerWidth > 768) return;

      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      dragItems.forEach((item, index) => {
        const speed = (index + 1) * 0.08;
        item.style.transform = `translate3d(0, ${scrollDiff * speed}px, 0)`;
      });

      clearTimeout(resetTimer);
      resetTimer = setTimeout(resetDragItems, 160);
    },
    { passive: true }
  );
}

/* Countdown */
const eventDate = new Date("2026-05-10T12:00:00+05:30").getTime();

const countdownElements = {
  countdown: document.getElementById("countdown"),
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function setText(element, value) {
  if (element) {
    element.textContent = String(value).padStart(2, "0");
  }
}

function updateCountdown() {
  const distance = eventDate - Date.now();

  if (!countdownElements.countdown) return;

  if (distance <= 0) {
    countdownElements.countdown.innerHTML = `
      <div class="started">
        The celebration has started!
      </div>
    `;
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  setText(countdownElements.days, days);
  setText(countdownElements.hours, hours);
  setText(countdownElements.minutes, minutes);
  setText(countdownElements.seconds, seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);