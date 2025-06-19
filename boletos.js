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

document.getElementById("formulario-boletos").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const tipo = document.getElementById("tipo").value;
  const mensaje = document.getElementById("mensaje");

  // VALIDACIONES EXTRA
  if (!nombre || nombre.split(" ").length < 2) {
    mensaje.innerText = "Por favor, escribe tu nombre completo (nombre y apellido).";
    mensaje.style.color = "red";
    return;
  }

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    mensaje.innerText = "Por favor, ingresa un correo electrónico válido.";
    mensaje.style.color = "red";
    return;
  }

  if (!tipo) {
    mensaje.innerText = "Por favor, selecciona un tipo de boleto.";
    mensaje.style.color = "red";
    return;
  }

  // GUARDAR EN FIRESTORE
  try {
    await addDoc(collection(db, "boletos"), {
      nombre,
      email,
      tipo,
      fecha: serverTimestamp()
    });

    mensaje.innerText = "¡Reserva registrada con éxito!";
    mensaje.style.color = "green";
    document.getElementById("formulario-boletos").reset();
  } catch (error) {
    console.error("Error al guardar:", error);
    mensaje.innerText = "Hubo un error al registrar tu reserva. Intenta de nuevo.";
    mensaje.style.color = "red";
  }
});
