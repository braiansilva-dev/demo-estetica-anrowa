document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reservaForm");
  const horaSelect = document.getElementById("hora");
  const fechaInput = document.getElementById("fecha");
  const popup = document.getElementById("popup");
  const cerrarPopup = document.getElementById("cerrarPopup");

  // Generar horarios (10:00 a 20:00 cada 30 minutos)
  for (let h = 10; h <= 20; h++) {
    ["00", "30"].forEach((min) => {
      if (h === 20 && min === "30") return; // no generar 20:30
      const option = document.createElement("option");
      option.value = `${String(h).padStart(2, "0")}:${min}`;
      option.textContent = `${String(h).padStart(2, "0")}:${min}`;
      horaSelect.appendChild(option);
    });
  }

  // Establecer fecha mínima = hoy
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  fechaInput.min = `${yyyy}-${mm}-${dd}`;

  // (Opcional) Establecer fecha máxima = hoy + 30 días
  const limite = new Date();
  limite.setDate(hoy.getDate() + 30);
  const yyyy2 = limite.getFullYear();
  const mm2 = String(limite.getMonth() + 1).padStart(2, "0");
  const dd2 = String(limite.getDate()).padStart(2, "0");
  fechaInput.max = `${yyyy2}-${mm2}-${dd2}`;

  // Bloquear domingos automáticamente en el calendario
  fechaInput.addEventListener("input", () => {
    const fechaSeleccionada = new Date(fechaInput.value + "T00:00:00");
    const diaSemana = fechaSeleccionada.getUTCDay(); // 0=domingo
    if (diaSemana === 0) {
      alert("No se realizan reservas los domingos. Por favor elegí otro día.");
      fechaInput.value = "";
    }
  });

  // Enviar reserva por WhatsApp (solo móvil)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const servicio = document.getElementById("servicio").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    if (!nombre || !telefono || !servicio || !fecha || !hora) {
      alert("Por favor completá todos los campos antes de continuar.");
      return;
    }

    // Validar día (no domingo)
    const fechaSeleccionada = new Date(fecha + "T00:00:00");
    const diaSemana = fechaSeleccionada.getUTCDay(); // 0 = domingo
    if (diaSemana === 0) {
      alert("No se realizan reservas los domingos.");
      return;
    }

    // Validar hora (10:00 a 20:00)
    const [h, m] = hora.split(":").map(Number);
    if (h < 10 || (h === 20 && m > 0)) {
      alert("El horario de atención es de 10:00 a 20:00.");
      return;
    }

    // Crear mensaje de WhatsApp
    const mensaje = encodeURIComponent(
      `¡Hola! 👋 Quiero reservar un turno en *Espacio Anrowa*.\n\n` +
      `🧖‍♀️ *Servicio:* ${servicio}\n📅 *Fecha:* ${fecha}\n🕒 *Hora:* ${hora}\n👤 *Nombre:* ${nombre}\n📞 *Teléfono:* ${telefono}`
    );

    const numero = "59891900344";
    const urlWhatsApp = `https://wa.me/${numero}?text=${mensaje}`;

    // Detectar si es un dispositivo móvil
    const esMovil = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    if (!esMovil) {
      alert("Por favor abrí esta página desde tu celular para enviar la reserva por WhatsApp.");
      return;
    }

    // Mostrar pop-up de confirmación primero
    popup.style.display = "flex";

    // Guardar el enlace para abrirlo después
    cerrarPopup.onclick = function () {
      popup.style.display = "none";
      form.reset();
      // Abrir WhatsApp recién ahora (acción del usuario)
      window.location.href = urlWhatsApp;
    };
  });

  // Si el usuario cierra el pop-up sin enviar
  cerrarPopup.addEventListener("click", () => {
    popup.style.display = "none";
  });
});