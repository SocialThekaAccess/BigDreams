const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const yearNode = document.querySelector("[data-year]");
const page = document.body.dataset.page;

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (page && siteNav) {
  for (const link of siteNav.querySelectorAll("a")) {
    const href = link.getAttribute("href") || "";
    if (
      (page === "home" && href === "index.html") ||
      (page === "about" && href === "about.html") ||
      (page === "services" && href === "services.html") ||
      (page === "single-service" && href === "services.html") ||
      (page === "blog" && href === "blogListing.html") ||
      (page === "blog-post" && href === "blogListing.html") ||
      (page === "migration-code" && href === "migrationCode.html") ||
      (page === "consultation-terms" && href === "clientForm.html") ||
      (page === "client-form" && href === "clientForm.html") ||
      (page === "contact" && href === "contactUs.html")
    ) {
      link.classList.add("is-active");
    }
  }
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

function injectMobileContactBar() {
  if (document.querySelector('.mobile-contact-bar')) {
    return;
  }

  const bar = document.createElement('div');
  bar.className = 'mobile-contact-bar';
  bar.innerHTML = `
    <a class="mobile-contact-btn mobile-contact-btn-call" href="tel:+61476241532" aria-label="Call Big Dream Education &amp; Visa Services">
      <span>Call</span>
    </a>
    <a class="mobile-contact-btn mobile-contact-btn-whatsapp" href="https://wa.me/61476241532" target="_blank" rel="noreferrer" aria-label="WhatsApp Big Dream Education &amp; Visa Services">
      <span>WhatsApp</span>
    </a>
  `;

  document.body.appendChild(bar);
}

function initReviewMarquee() {
  const marquee = document.querySelector('[data-review-marquee]');
  if (
    !marquee ||
    window.innerWidth < 760 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const originalCards = Array.from(marquee.children);
  if (originalCards.length === 0) {
    return;
  }

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    marquee.appendChild(clone);
  });

  let paused = false;
  let animationFrameId = 0;
  const speed = window.innerWidth < 760 ? 0.35 : 0.55;

  const step = () => {
    if (!paused) {
      marquee.scrollLeft += speed;

      if (marquee.scrollLeft >= marquee.scrollWidth / 2) {
        marquee.scrollLeft = 0;
      }
    }

    animationFrameId = window.requestAnimationFrame(step);
  };

  marquee.addEventListener('mouseenter', () => {
    paused = true;
  });

  marquee.addEventListener('mouseleave', () => {
    paused = false;
  });

  marquee.addEventListener('focusin', () => {
    paused = true;
  });

  marquee.addEventListener('focusout', () => {
    paused = false;
  });

  animationFrameId = window.requestAnimationFrame(step);

  window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
    }
  });
}

document.addEventListener('DOMContentLoaded', initReviewMarquee);
document.addEventListener('DOMContentLoaded', injectMobileContactBar);
