// Espera a que todo el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  // Configurar Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyBL3WnHWVkTo5ejHj5ueCu7FLm6u0uCkFM",
    authDomain: "geeklandfest.firebaseapp.com",
    projectId: "geeklandfest",
    storageBucket: "geeklandfest.appspot.com",
    messagingSenderId: "291993453509",
    appId: "1:291993453509:web:a8d6553f11b2d8b2e0c1ac",
  };

  // Inicializa Firebase y Firestore
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Inicializa EmailJS
  emailjs.init("sXw_FwbU1-ehORAve");

  const formulario = document.getElementById("formulario-boletos");
  const mensaje = document.getElementById("mensaje");
  const botonPago = document.querySelector(".boton-pago");
  const modal = document.getElementById("modal-confirmacion");

  const confirmNombre = document.getElementById("confirm-nombre");
  const confirmEmail = document.getElementById("confirm-email");
  const confirmTipo = document.getElementById("confirm-tipo");

  const btnConfirmar = document.getElementById("btn-confirmar");
  const btnCancelar = document.getElementById("btn-cancelar");

  let datosTemporales = {};
  let registroExitoso = false;

  // Desactiva el botón de pago
  botonPago.style.pointerEvents = "none";
  botonPago.style.opacity = "0.5";

  // Validación + mostrar modal
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const tipo = document.getElementById("tipo").value;

    if (!nombre || !email) {
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

    // Mostrar datos en el modal
    datosTemporales = { nombre, email, tipo };
    confirmNombre.textContent = nombre;
    confirmEmail.textContent = email;
    confirmTipo.textContent = tipo;
    modal.style.display = "flex";
  });

  // Cierra el modal
  btnCancelar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Confirma reserva y guarda en Firebase + correo
  btnConfirmar.addEventListener("click", async () => {
    modal.style.display = "none";
    mensaje.textContent = "Procesando...";

    try {
      await db.collection("registros").add({
        nombre: datosTemporales.nombre,
        email: datosTemporales.email,
        tipo: datosTemporales.tipo,
        fecha: new Date(),
      });

      await emailjs.send("service_uwh60xc", "template_id0h2p9", {
        nombre: datosTemporales.nombre,
        email: datosTemporales.email,
        tipo: datosTemporales.tipo,
      });

      mensaje.textContent = "Registro exitoso. ¡Gracias por tu reserva!";
      mensaje.style.color = "#00c853";

      botonPago.style.pointerEvents = "auto";
      botonPago.style.opacity = "1";
      registroExitoso = true;
    } catch (error) {
      console.error("Error al registrar o enviar correo:", error);
      mensaje.textContent = "Ocurrió un error. Intenta más tarde.";
      mensaje.style.color = "#d32f2f";
    }
  });

  // Enlace de pago
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
});
