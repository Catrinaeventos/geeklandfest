document.addEventListener('DOMContentLoaded', () => {
  const botonPago = document.querySelector('.boton-pago');
  const selectTipo = document.getElementById('tipo');

  botonPago.addEventListener('click', (e) => {
    e.preventDefault();

    const tipo = selectTipo.value;

    const links = {
      'preventa': 'https://mpago.li/1jMDkrG',
      'Preventa vip': 'https://mpago.la/2Xji7Dh',
      'Preventa VIP Pass 2 day': 'https://mpago.la/173GLyx',
      'Ultimate Pass Vip': 'https://mpago.la/32JN1nz',
    };

    const url = links[tipo];

    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Por favor selecciona un tipo de boleto válido.');
    }
  });
});

