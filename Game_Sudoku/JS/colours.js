// Función para guardar la configuración en localStorage
function guardarCambios() {
    const configuracion = obtenerConfiguracion();
    const configuracionesGuardadas = JSON.parse(localStorage.getItem('configuracion')) || [];

    // Buscar si ya existe una entrada para el mismo efecto y detalle
    const indice = configuracionesGuardadas.findIndex(item =>
        item.efecto === configuracion.efecto && item.detalle === configuracion.detalle
    );

    // Si existe, reemplazar, si no, agregar nueva
    if (indice !== -1) {
        configuracionesGuardadas[indice] = configuracion;
    } else {
        configuracionesGuardadas.push(configuracion);
    }

    localStorage.setItem('configuracion', JSON.stringify(configuracionesGuardadas));
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

// Función para calcular la luminosidad de un color en formato RGB
function calcularLuminosidad(rgbColor) {
    // Extraer los componentes R, G y B del color RGB
    const [r, g, b] = rgbColor.match(/\d+/g).map(Number);

    // Calcular la luminosidad usando la fórmula de luminosidad perceptual
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Función para determinar el color de texto (claro u oscuro) basado en la luminosidad del fondo
function obtenerColorDeTexto(rgbColor) {
    return calcularLuminosidad(rgbColor) > 186 ? '#000000' : '#FFFFFF'; // Texto negro si luminosidad es alta, blanco si es baja
}

// Función para aplicar la configuración desde localStorage
function aplicarCambios() {
    const configuracionesGuardadas = JSON.parse(localStorage.getItem('configuracion')) || [];
    configuracionesGuardadas.forEach(config => {
        aplicarColorEstilo(config);
    });
}

// Función para aplicar el background-color y los estilos usando switch
function aplicarColorEstilo(config) {
    const textoColor = obtenerColorDeTexto(config.color);

    switch (config.efecto) {
        case 'sin-efecto':
            switch (config.detalle) {
                case 'botones':
                    document.documentElement.style.setProperty('--botones-color', config.color);
                    document.documentElement.style.setProperty('--botones-text-color', textoColor);
                    break;
                case 'celdas':
                    document.documentElement.style.setProperty('--celdas-color', config.color);
                    document.documentElement.style.setProperty('--celdas-text-color', textoColor);
                    break;
                case 'tabla':
                    document.documentElement.style.setProperty('--tabla-color', config.color);
                    break;
                case 'subtablero':
                    document.documentElement.style.setProperty('--subTablero-color', config.color);
                    break;
                case 'resalto':    
                    aplicarColorResaltado(config.color);
                    document.documentElement.style.setProperty('--celdas-text-color', textoColor);
                    break;
            }
            break;
        case 'con-efecto':
            switch (config.detalle) {
                case 'botones':
                    document.documentElement.style.setProperty('--boton-color', config.color);
                    document.documentElement.style.setProperty('--botones-text-color', textoColor);
                    break;
                case 'modalidades':
                    document.documentElement.style.setProperty('--modalidad-color', config.color);
                    document.documentElement.style.setProperty('--botones-text-color', textoColor);
                    break;
                case 'celdas':
                    document.documentElement.style.setProperty('--celda-fondo', config.color);
                    document.documentElement.style.setProperty('--botones-text-color', textoColor);
                    break;
            }
            break;
    }
}

// Función para restaurar la configuración a la predeterminada
function restaurarCambios() {
    localStorage.removeItem('configuracion');
}

// Asignar eventos a los botones
document.getElementById('apply-btn').addEventListener('click', () => {
    if(juegoHaComenzado()) {
        // Si el juego ha comenzado, muestra el mensaje de confirmación
        mostrarConfirmacion("¿Estás seguro de que deseas aplicar estos cambios? Si iniciaste el juego, ¡se perderá el progreso actual!", function(continuar) {
            if (continuar) {
                guardarCambios();
                location.reload();
            }
        });
    } else {
        guardarCambios();
        location.reload();
    }
});

document.getElementById('restore-btn').addEventListener('click', () => {
    mostrarConfirmacion("¿Seguro que deseas revertir estos cambios? Si iniciaste el juego, ¡se perderá el progreso actual!", function(continuar) {
        if (continuar) {
            restaurarCambios();
            location.reload();
        }
    });
});
