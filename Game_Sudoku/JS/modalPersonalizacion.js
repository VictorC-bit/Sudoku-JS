// Función para manejar el cambio en las opciones de efecto
function manejarCambioEfecto() {
    const efectoSeleccionado = document.querySelector('input[name="effect"]:checked').value;

    if (efectoSeleccionado === 'sin-efecto') {
        document.getElementById('select-sin-efecto').style.display = 'block';
        document.getElementById('select-con-efecto').style.display = 'none';
    } else {
        document.getElementById('select-sin-efecto').style.display = 'none';
        document.getElementById('select-con-efecto').style.display = 'block';
    }

    manejarCambioDetalles();
}

// Función para manejar el cambio en los detalles
function manejarCambioDetalles() {
    const efectoSeleccionado = document.querySelector('input[name="effect"]:checked').value;
    let detalleSeleccionado = '';

    if (efectoSeleccionado === 'sin-efecto') {
        detalleSeleccionado = document.getElementById('detalles-sin-efecto').value;
    } else {
        detalleSeleccionado = document.getElementById('detalles-con-efecto').value;
    }

    // Verificar si la opción seleccionada es válida
    const opcionValida = detalleSeleccionado !== '';

    // Mostrar la paleta de colores si una opción válida está seleccionada
    document.querySelector('.color-palette').style.display = opcionValida ? 'block' : 'none';
}

// Función para obtener la configuración actual
function obtenerConfiguracion() {
    return {
        efecto: document.querySelector('input[name="effect"]:checked').value,
        detalle: document.querySelector('input[name="effect"]:checked').value === 'sin-efecto' ?
            document.getElementById('detalles-sin-efecto').value :
            document.getElementById('detalles-con-efecto').value,
        color: document.getElementById('color').value
    };
}

// Asignar eventos de cambio a los radios de efecto
document.querySelectorAll('input[name="effect"]').forEach(radio => {
    radio.addEventListener('change', manejarCambioEfecto);
});

// Asignar eventos de cambio a los selectores de detalles
document.getElementById('detalles-sin-efecto').addEventListener('change', manejarCambioDetalles);
document.getElementById('detalles-con-efecto').addEventListener('change', manejarCambioDetalles);

// Inicializar la vista con el estado actual del efecto
manejarCambioEfecto();