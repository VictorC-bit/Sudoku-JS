let historialCambios = []

// Crea tablero del sudoku 9x9
function crearTablero(sudoku) {
    // Creamos etiqueta "div"
    const tablero = document.createElement('div');
    // Asignamo Class con nombre "tablero"
    tablero.className = 'tablero';

    // Creo subtableros 3x3
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // Creamos etiqueta "div"
            const subTablero = document.createElement('div');
            // Asignamo Class con nombre "subTablero"
            subTablero.className = 'subTablero';

            // Creo celdas en los subtableros
            for (let k = 0; k < 9; k++) {
                // Obtenemos referencia fila y columna
                const fila = i * 3 + Math.floor(k / 3);
                const colum = j * 3 + (k % 3);
                // Hacemos hijo de la celdas al subtablero
                subTablero.appendChild(celdaSudoku(sudoku[fila][colum], fila, colum));
            }

            // Hacemos hijo del subtablero (3x3) al tablero (9x9)
            tablero.appendChild(subTablero);
        }
    }
    return tablero;
}

// Crea celdas para los subTableros
function celdaSudoku(valor, f, c) {
    // Creamos etiqueta "input"
    const celda = document.createElement('input');
    // Hacemos que sea tipo texto
    celda.type = 'text';
    // Hacemos una lista de class llamda "celdas-sudoku"
    celda.classList.add('celdas-sudoku');
    // Añade posiciones en fila y columna
    celda.setAttribute('data-fila', f);
    celda.setAttribute('data-columna', c);

    // Añadimos valor a celdas
    celda.value = valor;
    // Transformamos celda en tipo lectura
    celda.readOnly = true;
    celda.classList.add('predefinido');

    
    return celda;
}

// Guardo el contenido de la celda
function guardarCambio(celda) {
    if (!pausado()) {
        const fila = celda.getAttribute('data-fila');
        const columna = celda.getAttribute('data-columna');
        const valor = celda.value;
        const esAnotacion = window.globalState.estadoAnotaciones;

        historialCambios.push({
            fila,
            columna,
            valor,
            esAnotacion
        });
    }
}

function actualizarHistorialIncorrecto() {
    const celdasErroneas = document.querySelectorAll('.celdas-sudoku.incorrecto');
    const celdasErroneasMap = new Map();

    celdasErroneas.forEach(celda => {
        celdasErroneasMap.set(`${celda.dataset.fila}-${celda.dataset.columna}`, celda.value);
    });

    // Filtro historial para mantener celdas erroneas
    historialCambios = historialCambios.filter(actualizado => {
        return celdasErroneasMap.has(`${actualizado.fila}-${actualizado.columna}`) && !actualizado.esAnotacion;
    });
}

function desactivadoHistorial() {
    historialCambios = [];
}

function deshacerCambio() {
    if (!pausado()) {
        if (historialCambios.length !== 0) {
            const { fila, columna, valor, esAnotacion } = historialCambios.pop();

            // Encuentra la celda correcta usando los atributos data-fila y data-columna
            const celda = document.querySelector(`.celdas-sudoku[data-fila="${fila}"][data-columna="${columna}"]`);
            const contenedor = celda.closest('.celda-contenedor');

            window.globalState.estadoAnotaciones = esAnotacion;

            if (window.globalState.estadoAnotaciones) {

                if (celda.value === '') {
                    // Activar las anotaciones correspondientes
                    valor.split('').forEach(numero => {
                        const notacion = contenedor.querySelector(`.numero-notacion[data-numero="${numero}"]`);
                        if (!notacion.classList.contains('mostrar')) {
                            notacion.classList.add('mostrar');
                        } else {
                            notacion.classList.remove('mostrar');
                            notacion.classList.remove('resaltar');
                        }
                    });
                }
            } else {
                if (valor && celda.value === '') {
                    celda.value = valor;
                } else {
                    celda.value = '';
                    celda.classList.remove('resaltar');
                    celda.classList.remove('incorrecto');
                }

                contenedor.querySelectorAll('.numero-notacion').forEach(notacion => {
                    notacion.classList.remove('mostrar');
                });
            }
        }

        // Actualizar el estado del botón de comprobación
        habilitarBotonComprobacion();

        window.globalState.estadoAnotaciones = representoGuardado();
    }
}

// Elección dificultad del juego
function modalidades(dificultad) {
    let numOcultosMin, numOcultosMax;

    switch (dificultad) {
        case 'FACIL':
            numOcultosMin = 30;
            numOcultosMax = 40;
            break;
        case 'MEDIO':
            numOcultosMin = 40;
            numOcultosMax = 45;
            break;
        case 'DIFICIL':
            numOcultosMin = 45;
            numOcultosMax = 50;
            break;
        case 'EXPERTO':
            numOcultosMin = 50;
            numOcultosMax = 55;
            break;
        case 'EXTREMO':
            numOcultosMin = 55;
            numOcultosMax = 60;
            break;
    }

    // Generar un número aleatorio entre numOcultosMin y numOcultosMax
    return Math.floor(Math.random() * (numOcultosMax - numOcultosMin + 1)) + numOcultosMin;
}

// Ocultar una celda y asegurar una única solución
function ocultarCelda(celda) {
    celda.value = '';
    celda.removeAttribute('readonly');

    // Crear una etiqueta "div" para la celda vacía
    const contenedor = document.createElement('div');
    contenedor.classList.add('celda-contenedor');

    // Clonar la celda vacía
    const celdaClonada = celda.cloneNode(true);
    celdaClonada.classList.add('vacio');
    contenedor.appendChild(celdaClonada);

    // Crear las notaciones para la celda vacía
    contenedor.appendChild(notacionRecuadro());

    // Reemplazar la celda original con el contenedor
    celda.replaceWith(contenedor);
}

// Función para manejar el movimiento de flechas en el teclado dentro de un tablero 9x9
function movimientoTabla(event) {
    const fila = parseInt(event.target.getAttribute('data-fila'));
    const columna = parseInt(event.target.getAttribute('data-columna'));

    let nextFila = fila;
    let nextColumna = columna;

    switch (event.key) {
        case 'ArrowUp':
            nextFila = fila - 1;
            break;
        case 'ArrowDown':
            nextFila = fila + 1;
            break;
        case 'ArrowLeft':
            nextColumna = columna - 1;
            break;
        case 'ArrowRight':
            nextColumna = columna + 1;
            break;
    }

    document.querySelector(`.celdas-sudoku[data-fila="${nextFila}"][data-columna="${nextColumna}"]`).focus();
}

// Accesos globales
window.crearTablero = crearTablero;