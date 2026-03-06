const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const floatingTop = document.querySelector(".floating-top");

const toggleTopButton = () => {
  if (!floatingTop) return;
  if (window.scrollY > 320) {
    floatingTop.classList.add("show");
  } else {
    floatingTop.classList.remove("show");
  }
};

window.addEventListener("scroll", toggleTopButton, { passive: true });
toggleTopButton();

if (floatingTop) {
  floatingTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const header = document.querySelector(".top-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const navBackdrop = document.querySelector("#nav-backdrop");

const closeMenu = () => {
  if (!header || !menuToggle) return;
  header.classList.remove("menu-open");
  document.body.classList.remove("body-menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "فتح القائمة");
  if (navBackdrop) {
    navBackdrop.setAttribute("aria-hidden", "true");
  }
};

if (header && menuToggle && siteNav) {
  if (navBackdrop) {
    navBackdrop.setAttribute("aria-hidden", "true");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    document.body.classList.toggle("body-menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
    if (navBackdrop) {
      navBackdrop.setAttribute("aria-hidden", String(!isOpen));
    }
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeMenu);
  }

  document.addEventListener("click", (event) => {
    if (!header.classList.contains("menu-open")) return;
    if (!header.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeMenu();
    }
  });
}

const teacherPanel = document.querySelector("#teacher-inline-panel");
const teacherDetails = Array.from(document.querySelectorAll(".teacher-detail"));
const teacherReadLinks = Array.from(document.querySelectorAll(".teacher-read-more[data-target]"));
const teacherNewsItems = Array.from(document.querySelectorAll(".teacher-news-item[data-target]"));
const teacherCloseButtons = Array.from(document.querySelectorAll(".teacher-detail-close"));

const hideTeacherDetails = () => {
  if (!teacherPanel) return;
  teacherPanel.hidden = true;
  document.body.classList.remove("teacher-detail-mode");
  teacherDetails.forEach((detail) => {
    detail.hidden = true;
    detail.classList.remove("active");
  });
};

const showTeacherDetail = (targetId, updateHash = true) => {
  if (!teacherPanel) return;
  const target = document.getElementById(targetId);
  if (!target) return;

  teacherPanel.hidden = false;
  document.body.classList.add("teacher-detail-mode");
  teacherDetails.forEach((detail) => {
    const isTarget = detail.id === targetId;
    detail.hidden = !isTarget;
    detail.classList.toggle("active", isTarget);
  });

  if (updateHash && window.location.hash !== `#${targetId}`) {
    window.history.pushState(null, "", `#${targetId}`);
  }

  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
};

if (teacherPanel && teacherDetails.length) {
  hideTeacherDetails();

  teacherReadLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.dataset.target;
      if (!targetId) return;
      showTeacherDetail(targetId, true);
    });
  });

  teacherNewsItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.target.closest(".teacher-read-more")) return;
      const targetId = item.dataset.target;
      if (!targetId) return;
      showTeacherDetail(targetId, true);
    });

    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const targetId = item.dataset.target;
      if (!targetId) return;
      showTeacherDetail(targetId, true);
    });
  });

  teacherCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      hideTeacherDetails();
      window.history.pushState(null, "", "#teacher-posts");
      const teacherSection = document.querySelector("#teacher-posts");
      if (teacherSection) {
        teacherSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const openByHash = () => {
    const hash = window.location.hash.replace("#", "");
    if (hash.startsWith("teacher-detail-") && document.getElementById(hash)) {
      showTeacherDetail(hash, false);
    } else {
      hideTeacherDetails();
    }
  };

  window.addEventListener("hashchange", openByHash);
  openByHash();
}

const lightbox = document.querySelector("#image-lightbox");
const lightboxImg = document.querySelector("#image-lightbox-img");
const lightboxClose = document.querySelector("#image-lightbox-close");
const zoomableImages = Array.from(
  document.querySelectorAll(".teacher-detail-image img, .student-photo img")
);
const zoomableCards = Array.from(document.querySelectorAll(".media-card"));

const openImageLightbox = (img) => {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt || "صورة مكبرة";
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  requestAnimationFrame(() => {
    lightbox.classList.add("open");
  });
};

const closeImageLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  window.setTimeout(() => {
    lightbox.hidden = true;
  }, 200);
};

if (lightbox && lightboxImg) {
  zoomableImages.forEach((img) => {
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "تكبير الصورة");

    img.addEventListener("click", () => openImageLightbox(img));
    img.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openImageLightbox(img);
    });
  });

  zoomableCards.forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "تكبير صورة المشاركة");

    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      if (!img) return;
      openImageLightbox(img);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const img = card.querySelector("img");
      if (!img) return;
      openImageLightbox(img);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeImageLightbox);
  }

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeImageLightbox();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
      closeImageLightbox();
    }
  });
}

const articleToggleButtons = Array.from(document.querySelectorAll(".article-toggle[data-target]"));

articleToggleButtons.forEach((button) => {
  const targetId = button.dataset.target;
  if (!targetId) return;
  const content = document.getElementById(targetId);
  if (!content) return;

  button.addEventListener("click", () => {
    const expanded = content.classList.toggle("expanded");
    button.setAttribute("aria-expanded", String(expanded));
    button.textContent = expanded ? "إخفاء" : "قراءة المزيد";
  });
});

