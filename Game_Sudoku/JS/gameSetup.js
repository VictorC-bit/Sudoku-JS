// Variables globales
let dificultad = localStorage.getItem('dificultad') || 'FACIL';
let original;
let interno;
let celdaActiva = null;
const sudokuContainer = document.getElementById('sudoku-container');
let juegoIniciado = false;

// Función para agregar eventos a los botones numéricos
function agregarEventosBotonesNumericos() {
    document.querySelectorAll('#numeros .numero').forEach(boton => {
        boton.removeEventListener('click', controlBotonesNumerico);
        boton.addEventListener('click', controlBotonesNumerico);
    });
}

// Actualizar el color de los botones según la dificultad
function actualizarBotonesDificultad() {
    document.querySelectorAll('.dificultad').forEach(button => {
        button.classList.remove('seleccionado');
    });
    document.getElementById(dificultad).classList.add('seleccionado');
}

// Controlar funcionamiento botones numéricos
function controlBotonesNumerico(event) {
    if (!pausado()) {
        const num = event.target.textContent;
        if (!fin() && !celdaActiva.readOnly) {
            if (celdaActiva.value !== num) {
                celdaActiva.value = num;
            } else {
                celdaActiva.value = '';
            }

            if (celdaActiva.classList.contains('incorrecto') && (celdaActiva.value === '' || celdaActiva.value !== '')) {
                celdaActiva.classList.remove('incorrecto');
            }
            limpiarCeldasIncorrectas();
            celdaActiva.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
}

// Función para mostrar un tablero vacío antes de iniciar el juego
function preJuego() {
    juegoIniciado = false;

    // Limpiar el contenido del contenedor de Sudoku
    sudokuContainer.innerHTML = '';

    // Crear y mostrar un tablero vacío
    interno = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => ''));
    const tablero = crearTablero(interno);
    sudokuContainer.appendChild(tablero);

    //ocultarNumeros(tablero, modalidades(dificultad));
    actualizarBotonesDificultad();
    reiniciarJuego();

    tablero.querySelectorAll('.celdas-sudoku').forEach(celda => {
        celda.readOnly = true;
    });

    // Mostrar el botón de iniciar y ocultar el botón de pausar
    document.getElementById('boton-iniciar').style.display = 'inline';
    document.getElementById('boton-pausa').style.display = 'none';

    // Desactivar el botón de comprobar y completar
    document.getElementById('boton-comprobar').disabled = true;
    document.getElementById('boton-completar').disabled = true;
}

function juegoHaComenzado() {
    return juegoIniciado;
}

// Función para ocultar números con un tiempo límite
function ocultarNumerosConUnicaSolucionAsync(tablero, cantidadOcultar) {
    return new Promise((resolve, reject) => {
        const maxTime = 3000; // Tiempo máximo en milisegundos
        let startTime = Date.now();

        // Función interna para continuar el proceso
        function ocultarEnPasos(tablero, cantidadOcultar) {
            return new Promise((resolve, reject) => {
                let celdas = [];
                for (let fila = 0; fila < 9; fila++) {
                    for (let columna = 0; columna < 9; columna++) {
                        celdas.push([fila, columna]);
                    }
                }
                celdas = celdas.sort(() => Math.random() - 0.5); // Mezclar celdas aleatoriamente

                let celdasEliminadas = 0;

                function ocultarPaso() {
                    if (celdasEliminadas >= cantidadOcultar) {
                        resolve(tablero);
                        return;
                    }

                    if (Date.now() - startTime > maxTime) {
                        reject(new Error('Tiempo máximo de ocultación excedido'));
                        return;
                    }

                    let [fila, columna] = celdas.pop();
                    let valorOriginal = tablero[fila][columna];
                    tablero[fila][columna] = 0;  // Ocultar la celda

                    // Verificar si el tablero sigue teniendo una única solución
                    if (!tieneUnicaSolucion(tablero)) {
                        tablero[fila][columna] = valorOriginal;  // Restaurar si hay múltiples soluciones
                    } else {
                        celdasEliminadas++;
                    }

                    // Llamar a ocultarPaso después de un breve retraso para evitar el bloqueo
                    setTimeout(ocultarPaso, 0);
                }

                ocultarPaso();
            });
        }

        ocultarEnPasos(tablero, cantidadOcultar).then(resolve).catch(reject);
    });
}

// Inicio juego
async function inicioJuego() {
    juegoIniciado = true;

    // Mostrar el mensaje de carga y ocultar el tablero de Sudoku
    const loadingElement = document.getElementById('loading');
    const sudokuContainer = document.getElementById('sudoku-container');
    loadingElement.style.display = 'block';
    sudokuContainer.style.display = 'none';
    document.getElementById('boton-completar').disabled = false;

    // Ocultar el botón de iniciar y mostrar el botón de pausa
    document.getElementById('boton-iniciar').style.display = 'none';
    document.getElementById('boton-pausa').style.display = 'inline';

    reiniciarJuego();
    sudokuContainer.innerHTML = '';
    eliminarSudoku();

    try {
        original = generarSudoku();
        interno = JSON.parse(JSON.stringify(original));
        guardarSudoku(original);

        // Espera el resultado de la ocultación de números
        const tableroVacio = await ocultarNumerosConUnicaSolucionAsync(original, modalidades(dificultad));

        const tableroDOM = crearTablero(tableroVacio);
        sudokuContainer.appendChild(tableroDOM);
        ocultarCeldasConValorCero(tableroDOM);

        // Ocultar el mensaje de carga y mostrar el tablero
        loadingElement.style.display = 'none';
        sudokuContainer.style.display = 'block';

        tableroDOM.querySelectorAll('.celdas-sudoku').forEach(celda => {
            celda.addEventListener('input', function(event) {
                if (!/^[1-9]$/.test(event.target.value)) {
                    event.target.value = '';
                } else {
                    guardarCambio(celda);
                }
                habilitarBotonComprobacion();
                inputCelda(event);

                if (celda.classList.contains('incorrecto') && celda.value === '') {
                    celda.classList.remove('incorrecto');
                }
                limpiarCeldasIncorrectas();
            });
        });

        document.addEventListener('focusin', function(event) {
            if (event.target.classList.contains('celdas-sudoku')) {
                celdaActiva = event.target;
                actualizarResaltado(celdaActiva);
            }
        });

        document.querySelectorAll('.celdas-sudoku').forEach(cell => {
            cell.addEventListener('keydown', movimientoTabla);
        });

        agregarEventosBotonesNumericos();
        iniciarTemporizador();
        habilitarBotonComprobacion();
    } catch (error) {
        mostrarModal('Se produjo un error interno. Disculpe las molestias');
        preJuego();
    }
}

// Configurar los eventos del DOM después de cargar el contenido
document.addEventListener('DOMContentLoaded', function() {

    // Añadir evento al botón de iniciar
    document.getElementById('boton-iniciar').addEventListener('click', inicioJuego);

    document.querySelectorAll('.dificultad').forEach(button => {
        button.addEventListener('click', function() {
            const modalidadSeleccionada = button.id; // Guarda la dificultad seleccionada
            console.log('Modalidad seleccionada:', modalidadSeleccionada);
            console.log('Juego ha comenzado:', juegoHaComenzado());

            if (juegoHaComenzado()) {
                mostrarConfirmacion("¡Inicaste el juego! ¿Seguro que quieres cambiar la dificultad? Se perderá los cambios de este", function(continuar) {
                    if (continuar) {
                        dificultad = modalidadSeleccionada;
                        localStorage.setItem('dificultad', dificultad);
                        preJuego();
                    }
                });
            } else {
                dificultad = modalidadSeleccionada;
                localStorage.setItem('dificultad', dificultad);
                preJuego();
            }
        });
    });

    // Inicializar el pre-juego (tablero vacío)
    preJuego();

    aplicarCambios();
});

