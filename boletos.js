// Importa Firestore desde Firebase
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

// Inicializa Firestore
const app = getApp();
const db = getFirestore(app);

// Mapea los tipos de boleto con sus enlaces de pago de Mercado Pago
const linksPago = {
  "preventa": "https://mpago.li/1jMDkrG", // remplaza con el link real
  "Preventa vip": "https://mpago.la/2Xji7Dh",
  "Preventa VIP Pass 2 day": "https://mpago.la/173GLyx",
  "Ultimate Pass Vip": "https://mpago.la/32JN1nz"
};

// Captura el formulario
const formulario = document.getElementById("formulario-boletos");
const botonPago = document.querySelector(".boton-pago");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const tipo = document.getElementById("tipo").value;

  if (!nombre || !email) {
    mensaje.textContent = "Por favor completa todos los campos.";
    return;
  }

  try {
    await addDoc(collection(db, "registros"), {
      nombre,
      email,
      tipo,
      timestamp: new Date()
    });

    mensaje.textContent = "¡Registro exitoso! Serás redirigido al pago...";
    
    // Espera 2 segundos y redirige al pago
    setTimeout(() => {
      const urlPago = linksPago[tipo];
      if (urlPago) {
        window.location.href = urlPago;
      } else {
        mensaje.textContent = "Error al encontrar el link de pago.";
      }
    }, 2000);
  } catch (error) {
    console.error("Error al registrar en Firestore:", error);
    mensaje.textContent = "Ocurrió un error. Intenta nuevamente.";
  }
});
