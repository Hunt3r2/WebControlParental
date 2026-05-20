import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configuración de EmailJS
const EMAILJS_PUBLIC_KEY = "VpO_Ap--RXVIPpyBy";
const EMAILJS_SERVICE_ID = "service_ja5q4el";
const EMAILJS_TEMPLATE_ID = "template_ne9ed2c";

window.emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
});

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");
const contactButton = document.getElementById("contactButton");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const asunto = document.getElementById("asunto").value;
        const mensaje = document.getElementById("mensaje").value.trim();
        const privacidad = document.getElementById("privacidad").checked;

        if (!nombre || !email || !asunto || !mensaje || !privacidad) {
            mostrarEstado(
                "Completa todos los campos y acepta la política de privacidad.",
                "error"
            );
            return;
        }

        try {
            contactButton.disabled = true;
            contactButton.textContent = "Enviando...";

            // 1. Guardar consulta en Firebase
            await addDoc(collection(db, "contactMessages"), {
                nombre,
                email,
                asunto,
                mensaje,
                privacidadAceptada: true,
                leido: false,
                origen: "Formulario de contacto CyberGuardian",
                emailConfirmacionEnviado: true,
                creadoEn: serverTimestamp()
            });

            // 2. Enviar correo automático al usuario
            await window.emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    to_email: email,
                    nombre: nombre,
                    asunto: asunto,
                    mensaje: mensaje
                }
            );

            mostrarEstado(
                `Gracias, ${nombre}. Hemos recibido tu consulta correctamente y te hemos enviado un correo de confirmación.`,
                "success"
            );

            contactForm.reset();
        } catch (error) {
            console.error("Error al enviar el formulario:", error);

            mostrarEstado(
                "No se pudo completar el envío. Revisa Firebase, EmailJS o la consola del navegador.",
                "error"
            );
        } finally {
            contactButton.disabled = false;
            contactButton.textContent = "Enviar Consulta Técnica";
        }
    });
}

function mostrarEstado(mensaje, tipo) {
    contactStatus.textContent = mensaje;

    if (tipo === "success") {
        contactStatus.className =
            "rounded-2xl bg-green-50 border border-green-200 text-green-700 px-5 py-4 text-sm font-bold";
    } else {
        contactStatus.className =
            "rounded-2xl bg-red-50 border border-red-200 text-red-700 px-5 py-4 text-sm font-bold";
    }
}