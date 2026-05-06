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
// Immigration Journey Slider
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');
const sliderContainer = document.getElementById('immigrationSlider');

function showSlide(index) {
  if (!sliderContainer) return;
  
  currentSlideIndex = index;
  const translateX = -index * 100;
  sliderContainer.style.transform = `translateX(${translateX}%)`;
  
  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function currentSlide(index) {
  showSlide(index - 1);
}

function nextSlide() {
  const nextIndex = (currentSlideIndex + 1) % slides.length;
  showSlide(nextIndex);
}

// Auto-advance slider
if (slides.length > 0) {
  setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe journey steps and stat cards
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.journey-step, .stat-card, .success-carousel');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
    }
  }
  
  updateCounter();
}

// Trigger counter animations when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numberElement = entry.target.querySelector('.stat-number');
      const text = numberElement.textContent;
      const number = parseInt(text.replace(/\D/g, ''));
      
      if (number && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(numberElement, number);
      }
    }
  });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => statsObserver.observe(card));
});

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
  if (!marquee || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
