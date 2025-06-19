// Espera a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario-boletos");
  const botonPago = document.querySelector(".boton-pago");
  const mensaje = document.getElementById("mensaje");

  const links = {
    "preventa": "https://mpago.li/1jMDkrG", // remplaza con tus enlaces reales
    "Preventa vip": "https://mpago.la/2Xji7Dh",
    "Preventa VIP Pass 2 day": "https://mpago.la/173GLyx",
    "Ultimate Pass Vip": "https://mpago.la/32JN1nz"
  };

  let datosUsuario = {
    nombre: "",
    email: "",
    tipo: ""
  };

  formulario.addEventListener("submit", (e) => {
    e.preventDefault(); // ✋ Detiene el salto de página

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const tipo = document.getElementById("tipo").value;

    if (!nombre || !email || !tipo) {
      mensaje.textContent = "Por favor, completa todos los campos.";
      mensaje.style.color = "#d32f2f";
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      mensaje.textContent = "Por favor, ingresa un correo válido.";
      mensaje.style.color = "#d32f2f";
      return;
    }

    // ✅ Si todo está bien, guardamos los datos temporalmente
    datosUsuario = { nombre, email, tipo };
    mensaje.textContent = "¡Datos válidos! Ahora da clic en 'Pagar ahora'.";
    mensaje.style.color = "#00c853";
  });

  botonPago.addEventListener("click", (e) => {
    e.preventDefault(); // ✋ Evita que el <a href="#"> recargue la página

    if (!datosUsuario.nombre || !datosUsuario.email || !datosUsuario.tipo) {
      mensaje.textContent = "Primero llena el formulario correctamente.";
      mensaje.style.color = "#d32f2f";
      return;
    }

    const enlacePago = links[datosUsuario.tipo];
    if (enlacePago) {
      window.open(enlacePago, "_blank");
    } else {
      mensaje.textContent = "Error al generar el enlace de pago.";
      mensaje.style.color = "#d32f2f";
    }
  });
});
