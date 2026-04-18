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

function activarEnlaceActual() {
  const rutaActual = normalizarRuta(window.location.pathname);
  const enlaces = document.querySelectorAll(".nav-link");

  enlaces.forEach((enlace) => {
    const href = enlace.getAttribute("href");
    if (!href) return;

    const url = new URL(href, window.location.origin);
    const rutaEnlace = normalizarRuta(url.pathname);

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