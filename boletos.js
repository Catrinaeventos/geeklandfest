import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import emailjs from "https://cdn.emailjs.com/dist/email.min.js";

// Inicializa Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBL3WnHWVkTo5ejHj5ueCu7FLm6u0uCkFM",
  authDomain: "geeklandfest.firebaseapp.com",
  projectId: "geeklandfest",
  storageBucket: "geeklandfest.appspot.com",
  messagingSenderId: "291993453509",
  appId: "1:291993453509:web:a8d6553f11b2d8b2e0c1ac"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Inicializa EmailJS con tu public key
emailjs.init("sXw_FwbU1-ehORAve");

const formulario = document.getElementById("formulario-boletos");
const mensaje = document.getElementById("mensaje");
const botonPago = document.querySelector(".boton-pago");

let registroExitoso = false;

// Deshabilitar botón al inicio
botonPago.style.pointerEvents = "none";
botonPago.style.opacity = "0.5";

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const tipo = document.getElementById("tipo").value;

  if (nombre === "" || email === "") {
    mensaje.textContent = "Por favor completa todos los campos.";
    mensaje.style.color = "#d32f2f";
    registroExitoso = false;
    return;
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValido) {
    mensaje.textContent = "Correo electrónico no válido.";
    mensaje.style.color = "#d32f2f";
    registroExitoso = false;
    return;
  }

  try {
    await addDoc(collection(db, "registros"), {
      nombre,
      email,
      tipo,
      fecha: serverTimestamp(),
    });

    // Enviar correo de confirmación
    await emailjs.send("service_uwh60xc", "template_id0h2p9", {
      nombre: nombre,
      email: email,
      tipo: tipo,
    });

    mensaje.textContent = "Registro exitoso. ¡Gracias por tu reserva!";
    mensaje.style.color = "#00c853";

    botonPago.style.pointerEvents = "auto";
    botonPago.style.opacity = "1";
    registroExitoso = true;

  } catch (error) {
    console.error("Error al guardar o enviar correo:", error);
    mensaje.textContent = "Ocurrió un error. Intenta más tarde.";
    mensaje.style.color = "#d32f2f";
    registroExitoso = false;
  }
});

botonPago.addEventListener("click", (e) => {
  e.preventDefault();

  if (!registroExitoso) {
    mensaje.textContent = "Por favor, registra tus datos antes de pagar.";
    mensaje.style.color = "#d32f2f";
    return;
  }

  const tipo = document.getElementById("tipo").value;
  let url = "";

  switch (tipo) {
    case "preventa":
      url = "https://mpago.li/1jMDkrG";
      break;
    case "Preventa vip":
      url = "https://mpago.la/2Xji7Dh";
      break;
    case "Preventa VIP Pass 2 day":
      url = "https://mpago.la/173GLyx";
      break;
    case "Ultimate Pass Vip":
      url = "https://mpago.la/32JN1nz";
      break;
  }

  if (url) {
    window.open(url, "_blank");
  } else {
    mensaje.textContent = "Selecciona un tipo de entrada válido.";
    mensaje.style.color = "#d32f2f";
  }
});
