document.addEventListener("DOMContentLoaded", async () => {
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js");
  const { getFirestore, collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js");

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

  // Cargar EmailJS desde CDN
  const scriptEmailJS = document.createElement("script");
  scriptEmailJS.src = "https://cdn.emailjs.com/dist/email.min.js";
  scriptEmailJS.onload = () => {
    emailjs.init("sXw_FwbU1-ehORAve");
  };
  document.head.appendChild(scriptEmailJS);

  const formulario = document.getElementById("formulario-boletos");
  const mensaje = document.getElementById("mensaje");
  const botonPago = document.querySelector(".boton-pago");

  let registroExitoso = false;

  // Deshabilitar botón de pago al inicio
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

    const emailValido = /^[^\s@]+

