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

async function cargarLayout() {
  const base = obtenerRutaBase();

  await cargarComponente("#navbar-container", `${base}/components/navbar.html`);
  await cargarComponente("#footer-container", `${base}/components/footer.html`);

  if (typeof inicializarNavbar === "function") {
    inicializarNavbar();
  }
}

document.addEventListener("DOMContentLoaded", cargarLayout);