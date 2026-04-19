const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const backToTop = document.querySelector(".back-to-top");
const navLinks = document.querySelectorAll(".site-nav a");
const reveals = document.querySelectorAll(".reveal");
const slides = document.querySelectorAll(".hero-slide");
const dotsContainer = document.querySelector(".hero-dots");
const cookieBanner = document.getElementById("cookie-banner");
const acceptCookies = document.getElementById("accept-cookies");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const portfolioModal = document.getElementById("portfolio-modal");
const portfolioModalImage = document.getElementById("portfolio-modal-image");
const portfolioModalClose = document.getElementById("portfolio-modal-close");
const portfolioThumbs = document.querySelectorAll("[data-portfolio-image]");

let activeSlide = 0;
let sliderTimer;

const setScrolledHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
  backToTop?.classList.toggle("is-visible", window.scrollY > 520);
};

const closeMenu = () => {
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
};

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", setScrolledHeader);
setScrolledHeader();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

reveals.forEach((section) => revealObserver.observe(section));

const goToSlide = (index) => {
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });

  dotsContainer?.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });

  activeSlide = index;
};

const nextSlide = () => {
  const nextIndex = (activeSlide + 1) % slides.length;
  goToSlide(nextIndex);
};

if (slides.length && dotsContainer) {
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir al slide ${index + 1}`);
    if (index === 0) {
      dot.classList.add("is-active");
    }
    dot.addEventListener("click", () => {
      goToSlide(index);
      clearInterval(sliderTimer);
      sliderTimer = setInterval(nextSlide, 6500);
    });
    dotsContainer.appendChild(dot);
  });

  sliderTimer = setInterval(nextSlide, 6500);
}

if (cookieBanner && acceptCookies) {
  const hasConsent = localStorage.getItem("miss-paraguay-cookies");
  if (!hasConsent) {
    cookieBanner.hidden = false;
  }

  acceptCookies.addEventListener("click", () => {
    localStorage.setItem("miss-paraguay-cookies", "accepted");
    cookieBanner.hidden = true;
  });
}

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "Gracias por tu mensaje. La organizacion revisara tu consulta y respondera pronto.";
    contactForm.reset();
  });
}

const closePortfolioModal = () => {
  if (!portfolioModal) {
    return;
  }
  portfolioModal.hidden = true;
  portfolioModalImage?.setAttribute("src", "");
  portfolioModalImage?.setAttribute("alt", "");
};

if (portfolioModal && portfolioModalImage) {
  portfolioThumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      portfolioModalImage.src = thumb.dataset.portfolioImage || "";
      portfolioModalImage.alt = thumb.dataset.portfolioAlt || "Fotografia de portafolio";
      portfolioModal.hidden = false;
    });
  });

  portfolioModalClose?.addEventListener("click", closePortfolioModal);

  portfolioModal.addEventListener("click", (event) => {
    if (event.target === portfolioModal) {
      closePortfolioModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !portfolioModal.hidden) {
      closePortfolioModal();
    }
  });
}
