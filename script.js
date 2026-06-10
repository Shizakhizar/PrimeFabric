const body = document.body;
const year = document.querySelector("#year");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const loader = document.querySelector(".page-loader");
const reveals = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const testimonialTrack = document.querySelector(".testimonial-track");
const testimonialCards = document.querySelectorAll(".testimonial-card");
const testimonialDots = document.querySelector(".testimonial-dots");
const testimonialPrev = document.querySelector(".testimonial-prev");
const testimonialNext = document.querySelector(".testimonial-next");
const processTrack = document.querySelector(".process-grid");
const processSteps = document.querySelectorAll(".process-step");
const processDots = document.querySelector(".process-dots");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.querySelector(".lightbox");
const lightboxTitle = document.querySelector(".lightbox-title");
const lightboxCopy = document.querySelector(".lightbox-copy");
const lightboxClose = document.querySelector(".lightbox-close");
const magneticItems = document.querySelectorAll(".magnetic");
const tiltCards = document.querySelectorAll(".tilt-card");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

window.addEventListener("load", () => {
  body.classList.add("loaded");
  window.setTimeout(() => {
    if (loader) {
      loader.remove();
    }
  }, 700);
});

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("menu-open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      body.classList.remove("menu-open");
    });
  });
}

reveals.forEach((item) => {
  const delay = item.dataset.delay;
  if (delay) {
    item.style.setProperty("--delay", `${delay}s`);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
  }
);

reveals.forEach((item) => revealObserver.observe(item));

function animateCounter(element) {
  const target = Number(element.dataset.counter || 0);
  const duration = 1600;
  const start = performance.now();
  const suffix = element.dataset.suffix ?? "+";

  function step(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
    element.textContent = `${value.toLocaleString()}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.5,
  }
);

counters.forEach((counter) => counterObserver.observe(counter));

let activeTestimonial = 0;

function renderTestimonialDots() {
  if (!testimonialDots) {
    return;
  }

  testimonialDots.innerHTML = "";
  testimonialCards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.textContent = index + 1;
    dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
    dot.classList.toggle("active", index === activeTestimonial);
    dot.addEventListener("click", () => {
      activeTestimonial = index;
      updateTestimonials();
    });
    testimonialDots.appendChild(dot);
  });
}

function updateTestimonials() {
  if (testimonialTrack) {
    testimonialTrack.style.transform = `translateX(-${activeTestimonial * 100}%)`;
  }

  testimonialDots?.querySelectorAll("button").forEach((button, index) => {
    button.classList.toggle("active", index === activeTestimonial);
  });
}

if (testimonialCards.length > 0) {
  renderTestimonialDots();
  updateTestimonials();

  testimonialPrev?.addEventListener("click", () => {
    activeTestimonial = (activeTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    updateTestimonials();
  });

  testimonialNext?.addEventListener("click", () => {
    activeTestimonial = (activeTestimonial + 1) % testimonialCards.length;
    updateTestimonials();
  });

  if (!reduceMotion) {
    window.setInterval(() => {
      activeTestimonial = (activeTestimonial + 1) % testimonialCards.length;
      updateTestimonials();
    }, 4800);
  }
}

let activeProcessPage = 0;
let processIntervalId = null;

function getProcessColumns() {
  if (window.innerWidth <= 900) {
    return 1;
  }

  if (window.innerWidth <= 1100) {
    return 2;
  }

  return 3;
}

function getProcessPageCount() {
  const columns = getProcessColumns();
  return Math.max(1, Math.ceil(processSteps.length / columns));
}

function renderProcessDots() {
  if (!processDots) {
    return;
  }

  const pageCount = getProcessPageCount();
  processDots.innerHTML = "";

  for (let index = 0; index < pageCount; index += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to process group ${index + 1}`);
    dot.classList.toggle("active", index === activeProcessPage);
    dot.addEventListener("click", () => {
      activeProcessPage = index;
      updateProcessSlider();
      startProcessAutoplay();
    });
    processDots.appendChild(dot);
  }
}

function updateProcessSlider() {
  if (!processTrack) {
    return;
  }

  const columns = getProcessColumns();
  const pageCount = getProcessPageCount();
  activeProcessPage = Math.min(activeProcessPage, pageCount - 1);
  const startIndex = Math.min(activeProcessPage * columns, processSteps.length - 1);
  const offset = processSteps[startIndex]?.offsetLeft ?? 0;
  processTrack.style.transform = `translateX(-${offset}px)`;

  processDots?.querySelectorAll("button").forEach((button, index) => {
    button.classList.toggle("active", index === activeProcessPage);
  });
}

function startProcessAutoplay() {
  if (!processTrack || reduceMotion) {
    return;
  }

  window.clearInterval(processIntervalId);
  const pageCount = getProcessPageCount();

  if (pageCount <= 1) {
    return;
  }

  processIntervalId = window.setInterval(() => {
    activeProcessPage = (activeProcessPage + 1) % pageCount;
    updateProcessSlider();
  }, 4200);
}

if (processTrack && processSteps.length > 0) {
  renderProcessDots();
  updateProcessSlider();
  startProcessAutoplay();

  window.addEventListener("resize", () => {
    renderProcessDots();
    updateProcessSlider();
    startProcessAutoplay();
  });
}

function openLightbox(title, copy) {
  if (!lightbox || !lightboxTitle || !lightboxCopy) {
    return;
  }

  lightboxTitle.textContent = title;
  lightboxCopy.textContent = copy;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    openLightbox(item.dataset.title || "", item.dataset.copy || "");
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

if (!reduceMotion) {
  document.addEventListener("mousemove", (event) => {
    if (!cursorDot || !cursorRing) {
      return;
    }

    const { clientX, clientY } = event;
    cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
    cursorRing.animate(
      {
        transform: `translate(${clientX}px, ${clientY}px)`,
      },
      {
        duration: 180,
        fill: "forwards",
      }
    );
  });

  document.addEventListener("mouseleave", () => {
    body.classList.add("cursor-hidden");
  });

  document.addEventListener("mouseenter", () => {
    body.classList.remove("cursor-hidden");
  });

  magneticItems.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax || 0);
      item.style.transform = `translateY(${scrollY * speed * 0.001}px)`;
    });
  });
}

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});
