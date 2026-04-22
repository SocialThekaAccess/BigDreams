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
