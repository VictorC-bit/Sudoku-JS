// global.js
window.globalState = {
    estadoAnotaciones: false,
};
let estadoAnotacionesAnterior = null;

// Celda notacion
function notacionRecuadro() {
    // Añadimos etiqueta "div"
    const notaciones = document.createElement('div');
    notaciones.classList.add('notaciones-recuadro');

    // Formamos ese 3x3 para las casilla vacías
    for (let i = 1; i <= 9; i++) {
        // Añadimos otra etiqueta para "div"
        const numNotacion = document.createElement('div');
        numNotacion.classList.add('numero-notacion');
        numNotacion.setAttribute('data-numero', i);
        numNotacion.textContent = i;
        notaciones.appendChild(numNotacion);
    }

    return notaciones
}

// Modo activado
function activarModoAnotaciones(vacio) {
    // Click en las celdas vacías
    vacio.forEach(celda => celda.addEventListener('click', clickCelda));

    // Agrega clase al contenedor
    document.getElementById('sudoku-container').classList.add('modo-anotaciones-activado');
}

// Modo desactivado
function desactivarModoAnotaciones(vacio) {
    // Quitar click en las celdas vacías
    vacio.forEach(celda => celda.removeEventListener('click', clickCelda));

    // Quita clase al contenedor
    document.getElementById('sudoku-container').classList.remove('modo-anotaciones-activado');
}

// Manejo del evento click celdas vacías
function clickCelda() {
    // Al activar modo anotación
    document.querySelectorAll('.vacio').forEach(celda => celda.addEventListener('input', inputCelda));
    
    //document.querySelectorAll('.numero').forEach(boton => boton.addEventListener('click', inputCelda));
    // Activa la clase contenedor
    document.getElementById('sudoku-container').classList.add('modo-anotaciones-activado');
}

// Manejo de entrada en las casillas vacías
function inputCelda(event) {
    if (!pausado()) {
        // Recogemos entrada teclado
        const entrada = event.target;
        const contenedor = entrada.closest('.celda-contenedor');
        const numerosIngresados = entrada.value.replace(/\D/g, '');

        // Números solo ingresados muestra
        const numerosMostrados = new Set();

        numerosIngresados.split('').forEach(numero => {
            const notaciones = contenedor.querySelectorAll(`.numero-notacion[data-numero="${numero}"]`);
            const visible = Array.from(notaciones).some(notacion => notacion.classList.contains('mostrar'));

            notaciones.forEach(notacion => notacion.classList.toggle('mostrar', !visible));

            if (window.globalState.estadoAnotaciones) entrada.value = '';

            numerosMostrados.add(numero);
        });

        if (!window.globalState.estadoAnotaciones) {
            contenedor.querySelectorAll('.numero-notacion').forEach(notacion => {
                notacion.classList.remove('mostrar');
            });
        }

        actualizarResaltado(entrada);
    }
}

// En algún lugar de tu código, donde se maneja el cambio de color
function aplicarColorResaltado(color) {
    document.documentElement.style.setProperty('--resaltar-color', color);
}

function actualizarResaltado(celda) {
    const valor = celda.value;

    // Limpiar el resaltado de todas las celdas, botones y notaciones
    document.querySelectorAll('.celdas-sudoku, .numero, .numero-notacion').forEach(elemento => {
        elemento.classList.remove('resaltar');
    });

    // Si la celda tiene un valor, resaltar las celdas y notaciones correspondientes
    if (valor !== '') {
        document.querySelectorAll('.celdas-sudoku').forEach(celda => {
            if (celda.value === valor) {
                celda.classList.add('resaltar');
            }
        });

        document.querySelectorAll('.numero').forEach(num => {
            if (num.textContent === valor) {
                num.classList.add('resaltar');
            }
        });

        document.querySelectorAll('.numero-notacion').forEach(notacion => {
            if (notacion.textContent === valor && window.getComputedStyle(notacion).color !== 'rgba(0, 0, 0, 0)') {
                notacion.classList.add('resaltar');
            }
        });
    }
}

// Alterna entre activo/desactivo anotación
function modoAnotaciones() {

    const vacio = document.querySelectorAll('.vacio');
    window.globalState.estadoAnotaciones = !window.globalState.estadoAnotaciones;

    actualizarEstadoBotonAnotaciones();

    window.globalState.estadoAnotaciones ? activarModoAnotaciones(vacio) : desactivarModoAnotaciones(vacio);

    estadoGuardado(window.globalState.estadoAnotaciones);
}

// Guardar el estado actual de anotaciones antes de cambiar
function estadoGuardado(estadoGlobal) {
    estadoAnotacionesAnterior = estadoGlobal;
}

function representoGuardado() {
    return estadoAnotacionesAnterior;
}

function actualizarEstadoBotonAnotaciones() {
    // Obtener el botón de anotaciones
    const boton = document.getElementById('estado-anotaciones');

    boton.classList.add('animated');

    // Quitar clase de animación después de que termine
    setTimeout(() => {
        boton.classList.remove('animated');
    }, 500);

    // Actualizar el texto del botón según el estado de anotaciones
    if (window.globalState.estadoAnotaciones) {
        boton.textContent = 'Activado';
    } else {
        boton.textContent = 'Desactivado';
    }
}

// Acceso global
window.notacionRecuadro = notacionRecuadro;