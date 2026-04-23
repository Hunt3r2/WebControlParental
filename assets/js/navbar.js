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
  return ruta.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";
}

function marcarLinkActivo() {
  const rutaActual = normalizarRuta(window.location.pathname);
  const enlaces = document.querySelectorAll(".nav-link");

  enlaces.forEach((enlace) => {
    const href = enlace.getAttribute("href");
    if (!href) return;

    const rutaEnlace = normalizarRuta(new URL(href, window.location.origin).pathname);

    if (rutaActual === rutaEnlace) {
      enlace.classList.add("nav-link-active");
    }
  });
}

async function cargarLayout() {
  const base = obtenerRutaBase();

  await cargarComponente("#navbar-container", `${base}/components/navbar.html`);
  await cargarComponente("#footer-container", `${base}/components/footer.html`);

  if (typeof inicializarNavbar === "function") {
    inicializarNavbar();
  }

  marcarLinkActivo();
}

document.addEventListener("DOMContentLoaded", cargarLayout);

document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/index.html";
    const navLinks = document.querySelectorAll(".nav-link");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const siteHeader = document.getElementById("site-header");

    function normalizePath(path) {
        if (!path) return "";
        let cleanPath = path.replace(window.location.origin, "").replace(/\/+$/, "");
        return cleanPath === "" ? "/index.html" : cleanPath;
    }

    navLinks.forEach(link => {
        const linkPath = normalizePath(link.getAttribute("href"));

        if (linkPath === currentPath) {
            link.classList.add("nav-link-active");
        }
    });

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
            mobileMenu.classList.toggle("menu-open");
        });
    }

    window.addEventListener("scroll", () => {
        if (!siteHeader) return;

        if (window.scrollY > 12) {
            siteHeader.classList.add("scrolled");
        } else {
            siteHeader.classList.remove("scrolled");
        }
    });
});