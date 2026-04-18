async function cargarComponente(selector, ruta) {
  const contenedor = document.querySelector(selector);
  if (!contenedor) return;

  try {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar ${ruta}`);
    }

    const html = await respuesta.text();
    contenedor.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

function obtenerRutaBase() {
  const profundidad = window.location.pathname
    .split("/")
    .filter(Boolean)
    .length - 1;

  if (profundidad <= 0) return ".";
  return "../".repeat(profundidad).slice(0, -1);
}

async function cargarLayout() {
  const base = obtenerRutaBase();

  await cargarComponente("#navbar-container", `${base}/components/navbar.html`);
  await cargarComponente("#footer-container", `${base}/components/footer.html`);

  inicializarNavbar();
}

document.addEventListener("DOMContentLoaded", cargarLayout);