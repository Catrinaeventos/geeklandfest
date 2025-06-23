// ✅ Inicializa Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBL3WnHWVkTo5ejHj5ueCu7FLm6u0uCkFM",
  authDomain: "geeklandfest.firebaseapp.com",
  projectId: "geeklandfest",
  storageBucket: "geeklandfest.appspot.com",
  messagingSenderId: "291993453509",
  appId: "1:291993453509:web:a8d6553f11b2d8b2e0c1ac"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Inicializa EmailJS (asegúrate de tener la v4 cargada en index.html)
emailjs.init("sXw_FwbU1-ehORAve");

// ✅ Variables DOM
const formulario = document.getElementById("formulario-boletos");
const mensaje = document.getElementById("mensaje");
const botonPago = document.querySelector(".boton-pago");

const modal = document.getElementById("modal-confirmacion");
const btnCancelar = document.getElementById("btn-cancelar");
const btnConfirmar = document.getElementById("btn-confirmar");

let registroExitoso = false;
let datosUsuario = {};

// ✅ Botón de pago desactivado al inicio
botonPago.style.pointerEvents = "none";
botonPago.style.opacity = "0.5";

// ✅ Cancelar modal
btnCancelar.addEventListener("click", () => {
  modal.classList.remove("mostrar");
});

// ✅ Confirmar desde modal
btnConfirmar.addEventListener("click", async () => {
  const { nombre, email, tipo } = datosUsuario;

  try {
    // Guardar en Firestore
    await db.collection("registros").add({
      nombre,
      email,
      tipo,
      fecha: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Enviar correo con EmailJS
    await emailjs.send("service_uwh60xc", "template_id0h2p9", {
      nombre,
      email,
      tipo
    });

    mensaje.textContent = "Registro exitoso. ¡Gracias por tu reserva!";
    mensaje.style.color = "#00c853";

    registroExitoso = true;
    botonPago.style.pointerEvents = "auto";
    botonPago.style.opacity = "1";

  } catch (error) {
    console.error("Error al guardar o enviar correo:", error);
    mensaje.textContent = "Ocurrió un error. Intenta más tarde.";
    mensaje.style.color = "#d32f2f";
    registroExitoso = false;
  }

  modal.classList.remove("mostrar");
});

// ✅ Envío del formulario
formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const tipo = document.getElementById("tipo").value;

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

  // Guardar temporalmente para el modal
  datosUsuario = { nombre, email, tipo };

  // Mostrar en modal
  document.getElementById("confirm-nombre").textContent = nombre;
  document.getElementById("confirm-email").textContent = email;
  document.getElementById("confirm-tipo").textContent = tipo;

  modal.classList.add("mostrar");
});

// ✅ Redirección a pago
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
