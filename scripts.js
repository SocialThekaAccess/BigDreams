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

function initContactBookingForm() {
  if (page !== "contact") {
    return;
  }

  const form = document.getElementById("client-form");
  const bookingShell = document.getElementById("live-booking-shell");
  const bookingContainer = document.getElementById("live-booking-container");
  const bookingFallback = document.getElementById("live-booking-fallback");
  const bookingLink = document.getElementById("live-booking-link");
  const consultationTypeField = document.getElementById("consultation-type");
  const durationField = document.getElementById("consultation-duration");
  const bookingStatus = document.getElementById("booking-status");
  const successMessage = document.getElementById("form-success");
  const errorMessage = document.getElementById("form-error");
  const submitBtn = document.getElementById("submit-btn");
  const declarationDateField = form?.querySelector('input[name="Declaration Date"]');
  const dobField = form?.querySelector('input[name="Date of Birth"]');
  const defaultSuccessMarkup = successMessage.innerHTML;

  if (
    !form ||
    !bookingShell ||
    !bookingContainer ||
    !bookingFallback ||
    !bookingLink ||
    !consultationTypeField ||
    !durationField ||
    !bookingStatus ||
    !submitBtn
  ) {
    return;
  }

  const perthTimeZone = "Australia/Perth";
  const consultationDurationMinutes = 45;
  const bookingTypeDurations = {
    "In Person": consultationDurationMinutes,
    "Phone Call": consultationDurationMinutes,
    "Video Call": consultationDurationMinutes
  };

  function getZonedNow(timeZone) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date()).map((part) => [part.type, part.value])
    );

    return {
      isoDate: `${parts.year}-${parts.month}-${parts.day}`,
      hour: Number(parts.hour),
      minute: Number(parts.minute)
    };
  }

  function setBookingStatus(message, isError = false) {
    bookingStatus.textContent = message;
    bookingStatus.classList.toggle("is-error", isError);
  }

  function updateDuration() {
    const duration = bookingTypeDurations[consultationTypeField.value] || consultationDurationMinutes;
    durationField.value = `${duration} minutes`;
  }

  function initLiveBookingSurface() {
    const bookingUrl = (bookingShell.dataset.bookingUrl || "").trim();
    const providerLabel = (bookingShell.dataset.bookingProvider || "live calendar").trim();
    const embedEnabled = bookingShell.dataset.bookingEmbed === "true";

    bookingContainer.innerHTML = "";
    bookingLink.hidden = true;

    if (!bookingUrl) {
      setBookingStatus("Add your public booking URL to activate live scheduling on this page.", true);
      bookingFallback.hidden = false;
      return;
    }

    bookingLink.href = bookingUrl;
    bookingLink.textContent = `Open ${providerLabel}`;
    bookingLink.hidden = false;

    if (embedEnabled) {
      const iframe = document.createElement("iframe");
      iframe.src = bookingUrl;
      iframe.title = `${providerLabel} booking calendar`;
      iframe.loading = "lazy";
      bookingContainer.appendChild(iframe);
      bookingFallback.hidden = true;
      setBookingStatus(`Live booking is connected to ${providerLabel}. Clients will only see real appointment availability.`, false);
      return;
    }

    bookingFallback.hidden = false;
    setBookingStatus(`Live booking is connected to ${providerLabel}. Use the button above to open the real appointment calendar.`, false);
  }

  if (declarationDateField) {
    declarationDateField.value = getZonedNow(perthTimeZone).isoDate;
    declarationDateField.min = getZonedNow(perthTimeZone).isoDate;
  }

  if (dobField) {
    dobField.max = getZonedNow(perthTimeZone).isoDate;
  }

  consultationTypeField.addEventListener("change", () => {
    updateDuration();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    successMessage.style.display = "none";
    errorMessage.style.display = "none";

    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success || data.success === "true" || data.ok) {
          successMessage.innerHTML = defaultSuccessMarkup;
          successMessage.style.display = "block";
          form.reset();
          updateDuration();
          setBookingStatus("Complete the live calendar booking first, then submit the client information form below.");
          if (declarationDateField) {
            declarationDateField.value = getZonedNow(perthTimeZone).isoDate;
          }
          successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }

        successMessage.style.display = "block";
        successMessage.innerHTML = "<strong>Success!</strong> If this is your first submission, please check your email to activate the form. Otherwise, your booking request was received and a confirmation email should follow shortly.";
        form.reset();
        updateDuration();
        setBookingStatus("Complete the live calendar booking first, then submit the client information form below.");
        if (declarationDateField) {
          declarationDateField.value = getZonedNow(perthTimeZone).isoDate;
        }
        successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .catch(() => {
        errorMessage.style.display = "block";
        errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      });
  });

  updateDuration();
  initLiveBookingSurface();
}

document.addEventListener('DOMContentLoaded', initReviewMarquee);
document.addEventListener('DOMContentLoaded', injectMobileContactBar);
document.addEventListener('DOMContentLoaded', initContactBookingForm);
