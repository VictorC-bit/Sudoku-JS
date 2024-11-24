let tiempoInicio;
let temporizadorIntervalo;
let vidas;
let juegoTerminado;
let tiempoTranscurridoPausa = 0;
let juegoPausado = false;

function mostrarSudoku() {
    if (!pausado()) {
        mostrarConfirmacion("¿Estás seguro de que quieres completar el tablero? ¡Vas a hacer trampa y el juego se acabará!", function(continuar) {
            if (continuar) {
                const sudokuContainer = document.getElementById('sudoku-container');
            sudokuContainer.innerHTML = '';
            sudokuContainer.appendChild(crearTablero(obtenerSudoku()));
            manejarFinDelJuego();
            document.querySelectorAll('.celdas-sudoku').forEach(celda => {
                celda.classList.add('correcto');
            });
            }
        });
    }
}

// Función para comprobar el tablero
function comprobarTablero() {
    if (!pausado()) {
        const sudokuGuardado = obtenerSudoku();
        const celdas = document.querySelectorAll('.celdas-sudoku');
        let esCorrecto = true;
        let estaCompleto = true;

        celdas.forEach(celda => {
            const fila = parseInt(celda.dataset.fila);
            const columna = parseInt(celda.dataset.columna);

            const valorActual = parseInt(celda.value) || 0;
            const valorGuardado = sudokuGuardado[fila][columna];

            // Solo marcar las celdas si el tablero está completo
            if (estaCompleto) {
                actualizarResaltado(celda.value);
                if (valorActual !== valorGuardado) {
                    esCorrecto = false;
                    celda.classList.add('incorrecto');
                    celda.classList.remove('correcto');
                } else {
                    celda.classList.add('correcto');
                    celda.classList.remove('incorrecto');
                    celda.readOnly = true;
                }
            }
        });

        if (estaCompleto) {
            if (esCorrecto) {
                manejarFinDelJuego();
            } else {
                vidas--;
                const vidasElement = document.getElementById('vidas');
                
                vidasElement.classList.add('animated');

                setTimeout(() => {
                    vidasElement.classList.remove('animated');
                }, 500);

                // Actualizar el texto de vidas en el DOM
                vidasElement.textContent = vidas;

                if (vidas <= 0) {
                    mostrarModal('¡Se acabó las oportunidades!');
                    manejarFinDelJuego();
                } 
            }
        }

        habilitarBotonComprobacion();

        // Actualiza el historial para mantener solo las celdas incorrectas
        actualizarHistorialIncorrecto();
    }
}

// Fin del juuego
function manejarFinDelJuego() {

    if (temporizadorIntervalo) {
        clearInterval(temporizadorIntervalo);
    }

    document.querySelectorAll('.celdas-sudoku').forEach(celda => {
        celda.readOnly = true;
    });

    desactivadoHistorial();

    juegoTerminado = true;

}

function fin() {
    return juegoTerminado;
}

function reiniciarJuego() {
    vidas = 3;
    juegoTerminado = false;
    juegoPausado = false;
    tiempoTranscurridoPausa = 0;
    const botonPausa = document.getElementById('boton-pausa');

    // Detener el temporizador si está activo
    if (temporizadorIntervalo) {
        clearInterval(temporizadorIntervalo);
        temporizadorIntervalo = null;
    }

    document.getElementById('vidas').textContent = vidas;
    
    // Cambiar ícono a pausa
    botonPausa.querySelector('.icono-pausa').style.display = 'inline';
    botonPausa.querySelector('.icono-reanudar').style.display = 'none';

    // Restablecer la visualización del tiempo a "00:00"
    document.getElementById('tiempo').textContent = '00:00';
}

// Función para limpiar las clases de las celdas incorrectas
function limpiarCeldasIncorrectas() {
    const celdas = document.querySelectorAll('.celdas-sudoku');
    let hayErrores = false;

    celdas.forEach(celda => {
        if (celda.classList.contains('incorrecto')) {
            hayErrores = true;
        }
    });

    if (!hayErrores) {
        celdas.forEach(celda => {
            celda.classList.remove('correcto', 'incorrecto');
        });
    }
}

function iniciarTemporizador() {
    if (!fin()) {
        if (temporizadorIntervalo) {
            clearInterval(temporizadorIntervalo);
        }

        tiempoInicio = Date.now() - tiempoTranscurridoPausa;
        temporizadorIntervalo = setInterval(actualizarTemporizador, 1000);
        
    }
}

function actualizarTemporizador() {
    const tiempoTranscurrido = Date.now() - tiempoInicio;
    const minutos = Math.floor(tiempoTranscurrido / 60000);
    const segundos = Math.floor((tiempoTranscurrido % 60000) / 1000);

    document.getElementById('tiempo').textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

    if (minutos >= 60) {
        clearInterval(temporizadorIntervalo);
        mostrarModal('¡Se ha acabado el tiempo!');
    }
}

function pausarReanudarJuego() {
    const botonPausa = document.getElementById('boton-pausa');

    if (!fin()) {
        if (pausado()) {
            // Reanudar el juego
            document.querySelectorAll('.celdas-sudoku').forEach(celda => {
                celda.style.visibility = 'visible';
            });
            document.querySelectorAll('.celda-contenedor').forEach(contenedor => {
                contenedor.style.visibility = 'visible';
                contenedor.querySelectorAll('.numero-notacion').forEach(notacion => {
                    if (notacion.dataset.visibleBeforePause === 'true') {
                        notacion.classList.add('mostrar');
                    }
                });
            });

            juegoPausado = false;
            tiempoInicio = Date.now() - tiempoTranscurridoPausa;
            temporizadorIntervalo = setInterval(actualizarTemporizador, 1000);
            
            // Cambiar ícono a pausa
            botonPausa.querySelector('.icono-pausa').style.display = 'inline';
            botonPausa.querySelector('.icono-reanudar').style.display = 'none';
        } else {
            // Pausar el juego
            clearInterval(temporizadorIntervalo);
            juegoPausado = true;

            tiempoTranscurridoPausa = Date.now() - tiempoInicio;
            document.querySelectorAll('.celdas-sudoku').forEach(celda => {
                celda.style.visibility = 'hidden';
            });
            document.querySelectorAll('.celda-contenedor').forEach(contenedor => {
                contenedor.style.visibility = 'hidden';
                contenedor.querySelectorAll('.numero-notacion').forEach(notacion => {
                    notacion.dataset.visibleBeforePause = notacion.classList.contains('mostrar');
                    notacion.classList.remove('mostrar');
                });
            });

            // Cambiar ícono a reanudar
            botonPausa.querySelector('.icono-pausa').style.display = 'none';
            botonPausa.querySelector('.icono-reanudar').style.display = 'inline';
        }
    }
}

function pausado() {
    return juegoPausado;
}

/* AÑADIDO SUDOKU COMPLETADO */
// Función para habilitar o deshabilitar el botón de comprobación
function habilitarBotonComprobacion() {
    if (!pausado()) {
        const celdas = document.querySelectorAll('.celdas-sudoku');
        const botonComprobacion = document.getElementById('boton-comprobar');
        let estaCompleto = true;

        celdas.forEach(celda => {
            const valorCelda = celda.value;

            // Si la celda está vacía o tiene notaciones visibles, el tablero no está completo
            if (valorCelda === '' || window.globalState.estadoAnotaciones) {
                estaCompleto = false;
            }
        });

        if (estaCompleto && vidas > 0) {
            botonComprobacion.classList.remove('boton-desactivado');
            botonComprobacion.classList.add('boton-habilitado');
            botonComprobacion.disabled = false;
        } else {
            botonComprobacion.classList.remove('boton-habilitado');
            botonComprobacion.classList.add('boton-desactivado');
            botonComprobacion.disabled = true;
        }
    }
}

