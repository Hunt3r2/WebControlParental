async function cargarComponente(selector, ruta) {
  const contenedor = document.querySelector(selector);
  if (!contenedor) return;

  try {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) throw new Error(`No se pudo cargar ${ruta}`);
    contenedor.innerHTML = await respuesta.text();
  } catch (error) {
    console.error(error);
  }
}

function obtenerRutaBase() {
  const segmentos = window.location.pathname.split("/").filter(Boolean);
  const profundidad = segmentos.length - 1;

  if (profundidad <= 0) return ".";
  return "../".repeat(profundidad).slice(0, -1);
}

function normalizarRuta(ruta) {
  if (!ruta) return "/";

  return ruta
    .replace(window.location.origin, "")
    .replace(/\/index\.html$/, "")
    .replace(/\/+$/, "") || "/";
}

function marcarLinkActivo() {
  const rutaActual = normalizarRuta(window.location.pathname);
  const enlaces = document.querySelectorAll(".nav-link");

  enlaces.forEach((enlace) => {
    enlace.classList.remove("nav-link-active");

    const href = enlace.getAttribute("href");
    if (!href) return;

    const rutaEnlace = normalizarRuta(
      new URL(href, window.location.origin).pathname
    );

    const esInicio = rutaEnlace === "/";
    const esActivo =
      rutaActual === rutaEnlace ||
      (!esInicio && rutaActual.startsWith(rutaEnlace + "/"));

    if (esActivo) {
      enlace.classList.add("nav-link-active");
    }
  });
}

function inicializarNavbar() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const siteHeader = document.getElementById("site-header");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("menu-open");
    });
  }

  window.addEventListener("scroll", () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle("scrolled", window.scrollY > 12);
  });
}

async function cargarLayout() {
  const base = obtenerRutaBase();

  await cargarComponente("#navbar-container", `${base}/components/navbar.html`);
  await cargarComponente("#footer-container", `${base}/components/footer.html`);

marcarLinkActivo();
inicializarNavbar();
inicializarIndicadorNavbar();
}

document.addEventListener("DOMContentLoaded", cargarLayout);

function inicializarIndicadorNavbar() {
  const nav = document.getElementById("desktop-nav");
  if (!nav) return;

  let indicador = nav.querySelector(".nav-indicator");

  if (!indicador) {
    indicador = document.createElement("span");
    indicador.className = "nav-indicator";
    nav.appendChild(indicador);
  }

  const enlaces = Array.from(nav.querySelectorAll(":scope > .nav-link"));

  function moverIndicador(link) {
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    indicador.style.width = `${linkRect.width}px`;
    indicador.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
    indicador.style.opacity = "1";
  }

  function ocultarOVolverActivo() {
    const activo = enlaces.find((link) =>
      link.classList.contains("nav-link-active")
    );

    if (activo) {
      moverIndicador(activo);
    } else {
      indicador.style.opacity = "0";
      indicador.style.width = "0px";
    }
  }

  enlaces.forEach((link) => {
    link.addEventListener("mouseenter", () => moverIndicador(link));
  });

  nav.addEventListener("mouseleave", ocultarOVolverActivo);

  window.addEventListener("resize", ocultarOVolverActivo);

  requestAnimationFrame(ocultarOVolverActivo);
}