import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EMAILJS_PUBLIC_KEY = "VpO_Ap--RXVIPpyBy";
const EMAILJS_SERVICE_ID = "service_ja5q4el";
const EMAILJS_TEMPLATE_ID = "template_gg7a6sn";

window.emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
});

const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletter-email");
const newsletterMessage = document.getElementById("newsletter-message");
const newsletterButton = document.getElementById("btn-suscribirme");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const email = newsletterEmail.value.trim().toLowerCase();

        if (!email) {
            mostrarMensaje("Introduce un correo válido.", "error");
            return;
        }

        const emailId = encodeURIComponent(email);

        try {
            newsletterButton.disabled = true;
            newsletterButton.textContent = "Suscribiendo...";

            await setDoc(doc(db, "newsletterSubscribers", emailId), {
                email,
                emailId,
                activo: true,
                origen: "Página Actualidad - CyberGuardian",
                emailConfirmacionEnviado: true,
                creadoEn: serverTimestamp()
            });

            await window.emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    to_email: email,
                    email: email
                }
            );

            mostrarMensaje(
                "Suscripción completada. Te hemos enviado un correo de confirmación.",
                "success"
            );

            newsletterForm.reset();
        } catch (error) {
            console.error("Error en newsletter:", error);

            if (error.code === "permission-denied") {
                mostrarMensaje(
                    "Este correo puede que ya esté suscrito o no tienes permisos para registrarlo.",
                    "warning"
                );
            } else {
                mostrarMensaje(
                    "No se pudo completar la suscripción. Revisa Firebase, EmailJS o la consola.",
                    "error"
                );
            }
        } finally {
            newsletterButton.disabled = false;
            newsletterButton.textContent = "Suscribirme Ahora";
        }
    });
}

function mostrarMensaje(mensaje, tipo) {
    newsletterMessage.textContent = mensaje;
    newsletterMessage.classList.remove("hidden");

    if (tipo === "success") {
        newsletterMessage.className =
            "mt-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 px-5 py-4 text-sm font-bold";
    } else if (tipo === "warning") {
        newsletterMessage.className =
            "mt-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-700 px-5 py-4 text-sm font-bold";
    } else {
        newsletterMessage.className =
            "mt-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 px-5 py-4 text-sm font-bold";
    }
}