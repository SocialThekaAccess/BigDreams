const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const yearNode = document.querySelector("[data-year]");
const page = document.body.dataset.page;

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (page && siteNav) {
  const activeNavPaths = {
    home: ["/"],
    about: ["/about/"],
    services: ["/services/"],
    "single-service": ["/services/", "/services/skills-assessment-support/"],
    blog: ["/blog/"],
    "blog-post": ["/blog/"],
    "migration-code": ["/professional-standards/"],
    "consultation-terms": ["/consultation-terms/", "/book-a-consultation/"],
    "client-form": ["/book-a-consultation/"],
    contact: ["/contact/"]
  };

  for (const link of siteNav.querySelectorAll("a")) {
    const href = link.getAttribute("href");
    if (!href) {
      continue;
    }

    const navPath = new URL(href, window.location.origin).pathname;
    const normalizedNavPath = navPath === "/" ? navPath : `${navPath.replace(/\/+$/, "")}/`;
    const activePaths = activeNavPaths[page] || [];

    if (activePaths.includes(normalizedNavPath)) {
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
    <a class="mobile-contact-btn mobile-contact-btn-call" href="tel:+61476241532" aria-label="Call Big Dream Education and Visa Services">
      <span>Call</span>
    </a>
    <a class="mobile-contact-btn mobile-contact-btn-whatsapp" href="https://wa.me/61476241532" target="_blank" rel="noreferrer" aria-label="WhatsApp Big Dream Education and Visa Services">
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
  const consultationTypeField = document.getElementById("consultation-type");
  const durationField = document.getElementById("consultation-duration");
  const bookingDateField = document.getElementById("booking-date");
  const bookingSlotField = document.getElementById("booking-slot");
  const bookingStatus = document.getElementById("booking-status");
  const successMessage = document.getElementById("form-success");
  const errorMessage = document.getElementById("form-error");
  const submitBtn = document.getElementById("submit-btn");
  const declarationDateField = form?.querySelector('input[name="Declaration Date"]');
  const dobField = form?.querySelector('input[name="Date of Birth"]');
  const defaultSuccessMarkup = successMessage.innerHTML;

  if (
    !form ||
    !consultationTypeField ||
    !durationField ||
    !bookingDateField ||
    !bookingSlotField ||
    !bookingStatus ||
    !submitBtn
  ) {
    return;
  }

  const perthTimeZone = "Australia/Perth";
  const bookingWindowDays = 45;
  const consultationDurationMinutes = 60;
  const consultationBufferMinutes = 30;
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

  function createDateFromIso(isoDate) {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  }

  function addDays(isoDate, daysToAdd) {
    const date = createDateFromIso(isoDate);
    date.setUTCDate(date.getUTCDate() + daysToAdd);
    return date.toISOString().slice(0, 10);
  }

  function formatDateLabel(isoDate) {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: perthTimeZone,
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(createDateFromIso(isoDate));
  }

  function formatTimeLabel(time24) {
    const [hours, minutes] = time24.split(":").map(Number);
    const displayDate = new Date(Date.UTC(2000, 0, 1, hours, minutes, 0));
    return new Intl.DateTimeFormat("en-AU", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC"
    }).format(displayDate);
  }

  function addMinutes(time24, minutesToAdd) {
    const [hours, minutes] = time24.split(":").map(Number);
    const totalMinutes = (hours * 60) + minutes + minutesToAdd;
    const nextHours = Math.floor(totalMinutes / 60);
    const nextMinutes = totalMinutes % 60;
    return `${String(nextHours).padStart(2, "0")}:${String(nextMinutes).padStart(2, "0")}`;
  }

  function resetSelectOptions(selectNode, placeholder) {
    selectNode.innerHTML = "";
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    selectNode.appendChild(placeholderOption);
  }

  function setBookingStatus(message, isError = false) {
    bookingStatus.textContent = message;
    bookingStatus.classList.toggle("is-error", isError);
  }

  function updateDuration() {
    const duration = bookingTypeDurations[consultationTypeField.value] || consultationDurationMinutes;
    durationField.value = `${duration} minutes`;
  }

  function getPreferredDates() {
    const nowInPerth = getZonedNow(perthTimeZone);
    const dates = [];

    for (let offset = 1; offset <= bookingWindowDays; offset += 1) {
      const isoDate = addDays(nowInPerth.isoDate, offset);
      const weekday = createDateFromIso(isoDate).getUTCDay();

      if (weekday >= 1 && weekday <= 5) {
        dates.push(isoDate);
      }
    }

    return dates;
  }

  function getPreferredTimeSlots() {
    const slots = [];
    let totalMinutes = 9 * 60;
    const lastStartMinutes = (18 * 60) - consultationDurationMinutes;
    const stepMinutes = consultationDurationMinutes;

    while (totalMinutes <= lastStartMinutes) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      slots.push(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
      totalMinutes += stepMinutes;
    }

    return slots;
  }

  function populatePreferredDates() {
    const currentValue = bookingDateField.value;
    const availableDates = getPreferredDates();

    resetSelectOptions(bookingDateField, "Select preferred date");

    availableDates.forEach((isoDate) => {
      const option = document.createElement("option");
      option.value = isoDate;
      option.textContent = formatDateLabel(isoDate);
      bookingDateField.appendChild(option);
    });

    if (availableDates.includes(currentValue)) {
      bookingDateField.value = currentValue;
    }
  }

  function populatePreferredTimeSlots() {
    const currentValue = bookingSlotField.value;
    const availableSlots = getPreferredTimeSlots();
    const duration = bookingTypeDurations[consultationTypeField.value] || consultationDurationMinutes;

    resetSelectOptions(bookingSlotField, "Select preferred time");

    availableSlots.forEach((slot) => {
      const option = document.createElement("option");
      const endTime = addMinutes(slot, duration);
      option.value = slot;
      option.textContent = `${formatTimeLabel(slot)} to ${formatTimeLabel(endTime)} AWST`;
      bookingSlotField.appendChild(option);
    });

    if (availableSlots.includes(currentValue)) {
      bookingSlotField.value = currentValue;
    }
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
    populatePreferredTimeSlots();
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
          populatePreferredDates();
          populatePreferredTimeSlots();
          setBookingStatus("Choose your preferred date and time in AWST. Our team will contact you to confirm the final appointment time.");
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
        populatePreferredDates();
        populatePreferredTimeSlots();
        setBookingStatus("Choose your preferred date and time in AWST. Our team will contact you to confirm the final appointment time.");
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
  populatePreferredDates();
  populatePreferredTimeSlots();
}

document.addEventListener('DOMContentLoaded', initReviewMarquee);
document.addEventListener('DOMContentLoaded', injectMobileContactBar);
document.addEventListener('DOMContentLoaded', initContactBookingForm);

