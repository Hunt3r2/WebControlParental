function inicializarNavbar() {
  activarEnlaceActual();
  configurarMenuMovil();
  configurarScrollNavbar();
  configurarBotonPanico();
}

function normalizarRuta(ruta) {
  if (!ruta || ruta === "/") return "/index.html";
  return ruta.replace(/\/+$/, "") || "/index.html";
}

function limpiarRuta(ruta) {
  return ruta
    .replace(/index\.html$/, "")
    .replace(/\/$/, "");
}

function activarEnlaceActual() {
  const rutaActual = limpiarRuta(window.location.pathname);
  const enlaces = document.querySelectorAll(".nav-link");

  enlaces.forEach((enlace) => {
    const href = enlace.getAttribute("href");
    if (!href) return;

    const rutaEnlace = limpiarRuta(new URL(href, window.location.origin).pathname);

    if (rutaEnlace === rutaActual) {
      enlace.classList.add("nav-link-active");
    }
  });
}

function configurarMenuMovil() {
  const boton = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const enlacesMoviles = document.querySelectorAll(".mobile-link");

  if (!boton || !menu) return;

  boton.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  enlacesMoviles.forEach((enlace) => {
    enlace.addEventListener("click", () => {
      menu.classList.add("hidden");
    });
  });
}

function configurarScrollNavbar() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const actualizarEstado = () => {
    if (window.scrollY > 20) {
      header.classList.add("nav-scrolled");
    } else {
      header.classList.remove("nav-scrolled");
    }
  };

  actualizarEstado();
  window.addEventListener("scroll", actualizarEstado);
}

function configurarBotonPanico() {
  const botones = [
    document.getElementById("panic-button"),
    document.getElementById("panic-button-mobile")
  ].filter(Boolean);

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const confirmar = window.confirm(
        "¿Quieres acceder a ayuda inmediata? Serás redirigido al 017 de INCIBE."
      );

      if (confirmar) {
        window.location.href = "tel:017";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const btnExplorar = document.getElementById("btn-explorar-boletines");
  const seccionBoletines = document.getElementById("seccion-boletines");
  const btnVerInforme = document.getElementById("btn-ver-informe");

  const filtroBtns = document.querySelectorAll(".filtro-btn");
  const newsCards = document.querySelectorAll(".news-card");

  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterEmail = document.getElementById("newsletter-email");
  const newsletterMessage = document.getElementById("newsletter-message");
  const btnSuscribirme = document.getElementById("btn-suscribirme");

  // =========================
  // 1. HERO CTA
  // =========================
  if (btnExplorar && seccionBoletines) {
    btnExplorar.addEventListener("click", () => {
      seccionBoletines.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  // =========================
  // 2. BOTÓN INFORME COMPLETO
  // =========================
  if (btnVerInforme) {
    btnVerInforme.addEventListener("click", () => {
      window.location.href = "/pages/articulos/tendencias-redes.html";
    });
  }

  // =========================
  // 3. CARDS CLICABLES
  // =========================
  newsCards.forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    const link = card.dataset.link;

    card.addEventListener("click", () => {
      if (link) {
        window.location.href = link;
      }
    });

    card.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && link) {
        e.preventDefault();
        window.location.href = link;
      }
    });
  });

  // =========================
  // 4. FILTROS
  // =========================
  filtroBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Estilo activo
      filtroBtns.forEach((b) => {
        b.classList.remove("bg-primary", "text-white");
        b.classList.add("bg-surface-container-highest");
      });

      btn.classList.remove("bg-surface-container-highest");
      btn.classList.add("bg-primary", "text-white");

      // Filtrado
      newsCards.forEach((card) => {
        const category = card.dataset.category;

        if (filter === "todos" || category === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // =========================
  // 5. NEWSLETTER
  // =========================
  function showMessage(text, type = "success") {
    if (!newsletterMessage) return;

    newsletterMessage.textContent = text;
    newsletterMessage.classList.remove("hidden", "text-red-600", "text-green-600");

    if (type === "error") {
      newsletterMessage.classList.add("text-red-600");
    } else {
      newsletterMessage.classList.add("text-green-600");
    }
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = newsletterEmail.value.trim().toLowerCase();

      if (!email) {
        showMessage("Introduce un correo electrónico.", "error");
        newsletterEmail.focus();
        return;
      }

      if (!validarEmail(email)) {
        showMessage("El formato del correo no es válido.", "error");
        newsletterEmail.focus();
        return;
      }

      try {
        const suscripcionesGuardadas = JSON.parse(localStorage.getItem("cyberguardian_newsletter")) || [];

        if (suscripcionesGuardadas.includes(email)) {
          showMessage("Este correo ya está suscrito.", "error");
          return;
        }

        suscripcionesGuardadas.push(email);
        localStorage.setItem("cyberguardian_newsletter", JSON.stringify(suscripcionesGuardadas));

        showMessage("Suscripción realizada correctamente.");
        newsletterForm.reset();
      } catch (error) {
        console.error("Error al guardar la suscripción:", error);
        showMessage("Ha ocurrido un error al guardar la suscripción.", "error");
      }
    });
  }

  // =========================
  // 6. MEJORA VISUAL INPUT
  // =========================
  if (newsletterEmail) {
    newsletterEmail.addEventListener("input", () => {
      newsletterEmail.classList.remove("ring-red-500");
      if (newsletterMessage && !newsletterMessage.classList.contains("hidden")) {
        newsletterMessage.classList.add("hidden");
      }
    });
  }
});

const newsletterForm = document.getElementById("newsletter-form");
const newsletterMessage = document.getElementById("newsletter-message");

function showMessage(text, type = "success") {
    if (!newsletterMessage) return;

    newsletterMessage.textContent = text;
    newsletterMessage.classList.remove("hidden", "text-red-600", "text-green-600");

    if (type === "error") {
        newsletterMessage.classList.add("text-red-600");
    } else {
        newsletterMessage.classList.add("text-green-600");
    }
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (newsletterForm) {
    const newsletterEmail = newsletterForm.querySelector('input[name="email"]');

    newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(newsletterForm);
        const email = (formData.get("email") || "").toString().trim().toLowerCase();

        console.log("Email leído:", email);

        if (!email) {
            newsletterEmail.classList.add("ring-2", "ring-red-500");
            showMessage("Introduce un correo electrónico.", "error");
            newsletterEmail.focus();
            return;
        }

        if (!validarEmail(email)) {
            newsletterEmail.classList.add("ring-2", "ring-red-500");
            showMessage("El formato del correo no es válido.", "error");
            newsletterEmail.focus();
            return;
        }

        try {
            const suscripcionesGuardadas = JSON.parse(
                localStorage.getItem("cyberguardian_newsletter")
            ) || [];

            if (suscripcionesGuardadas.includes(email)) {
                showMessage("Este correo ya está suscrito.", "error");
                return;
            }

            suscripcionesGuardadas.push(email);
            localStorage.setItem(
                "cyberguardian_newsletter",
                JSON.stringify(suscripcionesGuardadas)
            );

            newsletterEmail.classList.remove("ring-2", "ring-red-500");
            showMessage("Suscripción realizada correctamente.");
            newsletterForm.reset();
        } catch (error) {
            console.error("Error al guardar la suscripción:", error);
            showMessage("Ha ocurrido un error al guardar la suscripción.", "error");
        }
    });

    newsletterEmail.addEventListener("input", () => {
        newsletterEmail.classList.remove("ring-2", "ring-red-500");
        newsletterMessage.classList.add("hidden");
    });
}