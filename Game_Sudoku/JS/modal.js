const modal = document.getElementById('miModal');
const closeButton = document.querySelector('.close-button');

// Modal de Personalización
const customizeModal = document.getElementById("modal-personalizacion");
const openCustomizeBtn = document.getElementById("personalizarBtn");

// Evento para abrir el modal de personalización
openCustomizeBtn.onclick = function() {
    customizeModal.style.display = "block";
}

// Cerrar el modal de personalización si se hace clic fuera de él
window.onclick = function(event) {
    if (event.target == customizeModal) {
        customizeModal.style.display = "none";
    }
}

// Función para mostrar el modal con un mensaje
function mostrarModal(mensaje) {
    document.getElementById('modal-mensaje').textContent = mensaje;
    modal.classList.add('show');
}

// Función para ocultar el modal
function ocultarModal() {
    modal.classList.remove('show');
}

// Cuando el usuario hace clic en el botón de cerrar, oculta el modal
closeButton.addEventListener('click', ocultarModal);

// Cuando el usuario hace clic en cualquier parte fuera del modal, oculta el modal
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        ocultarModal();
    }
});

// Función para mostrar el modal de confirmación
function mostrarConfirmacion(mensaje, callback) {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.querySelector('p').textContent = mensaje;

    confirmModal.style.display = 'block';

    document.getElementById('confirmYes').onclick = function() {
        confirmModal.style.display = 'none';
        callback(true);
    };

    document.getElementById('confirmNo').onclick = function() {
        confirmModal.style.display = 'none';
        callback(false);
    };
}

// Exponer las funciones al ámbito global para que puedan ser utilizadas en otros scripts
window.mostrarModal = mostrarModal;
window.ocultarModal = ocultarModal;
window.mostrarConfirmacion = mostrarConfirmacion;