import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

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

const formulario = document.getElementById("formulario-boletos");
const mensaje = document.getElementById("mensaje");
const botonPago = document.querySelector(".boton-pago");

// Modal
const modal = document.getElementById("modal-confirmacion");
const confirmNombre = document.getElementById("confirm-nombre");
const confirmEmail = document.getElementById("confirm-email");
const confirmTipo = document.getElementById("confirm-tipo");
const btnConfirmar = document.getElementById("btn-confirmar");
const btnCancelar = document.getElementById("btn-cancelar");

// Estado
let datosReserva = {};
let registroExitoso = false;

// Deshabilita el botón de pago
botonPago.style.pointerEvents = "none";
botonPago.style.opacity = "0.5";

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const tipo = document.getElementById("tipo").value;

  // Validaciones
  if (nombre === "" || email === "") {
    mensaje.textContent = "Por favor completa todos los campos.";
    mensaje.style.color = "#d32f2f";
    return;
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValido) {
    mensaje.textContent = "Correo electrónico no válido.";
    mensaje.style.color = "#d32f2f";
    return;
  }

  // Mostrar modal con los datos
  confirmNombre.textContent = nombre;
  confirmEmail.textContent = email;
  confirmTipo.textContent = tipo;
  modal.style.display = "flex";

  datosReserva = { nombre, email, tipo };
});

// Confirmación final del modal
btnConfirmar.addEventListener("click", async () => {
  modal.style.display = "none";

  try {
    await addDoc(collection(db, "registros"), {
      ...datosReserva,
      fecha: serverTimestamp(),
    });

    mensaje.textContent = "Registro exitoso. ¡Gracias por tu reserva!";
    mensaje.style.color = "#00c853";
    registroExitoso = true;

    // Habilita el botón de pago
    botonPago.style.pointerEvents = "auto";
    botonPago.style.opacity = "1";

  } catch (error) {
    console.error("Error en Firebase:", error);
    mensaje.textContent = "Ocurrió un error al guardar tus datos.";
    mensaje.style.color = "#d32f2f";
  }
});

// Cancelar modal
btnCancelar.addEventListener("click", () => {
  modal.style.display = "none";
});

// Botón de pago
botonPago.addEventListener("click", (e) => {
  e.preventDefault();

  if (!registroExitoso) {
    mensaje.textContent = "Primero registra tus datos.";
    mensaje.style.color = "#d32f2f";
    return;
  }

  const tipo = datosReserva.tipo;
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
