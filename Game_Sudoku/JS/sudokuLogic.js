// Generamos sudoku válidado
function generarSudoku(maxIntentos = 10) {
    const num = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let intentos = 0;

    while (intentos < maxIntentos) {
        const tablero = crearTableroVacio();

        if (rellenoSudoku(tablero, num)) {
            return tablero;
        } else {
            intentos++;
        }
    }
    return null;
}

/* Para activar la tabla debe de cambiar "''" por "0" */
// Crear tablero vacío
function crearTableroVacio() {
    return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));
}

// Completo el sudoku iteradamente
function rellenoSudoku(t, n) {
    let esValido = true;

    for (let fila = 0; fila < 9 && esValido; fila++) {
        esValido = rellenoFila(t, fila, n);
    }

    return esValido;
}

// Rellena las filas
function rellenoFila(t, f, n) {
    const numerosMezclados = mezcla(n);

    for (let colum = 0; colum < 9; colum++) {
        if (t[f][colum] === 0) {
            for (let num of numerosMezclados) {
                if (validarFilColum(t, f, colum, num)) {
                    t[f][colum] = num;
                    if (rellenoFila(t, f, n)) {
                        return true;
                    }
                    t[f][colum] = 0;
                }
            }
            return false;
        }
    }
    return true;
}

// Validamos esas filas y columnas
function validarFilColum(t, f, c, n) {
    let esValido = true;
    const fila = Math.floor(f / 3) * 3;
    const colum = Math.floor(c / 3) * 3;

    // Valida fila y columna
    for (let i = 0; i < 9 && esValido; i++) {
        if (t[f][i] === n || t[i][c] === n) {
            esValido = false;
        }
    }

    // Valida subtablero 3x3
    for (let i = fila; i < fila + 3 && esValido; i++) {
        for (let j = colum; j < colum + 3; j++) {
            if (t[i][j] === n) {
                esValido = false;
            }
        }
    }

    return esValido;
}

// Mezcla con random los números
function mezcla(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Convertir celdas con valor 0 en celdas vacías visualmente
function ocultarCeldasConValorCero(tableroElement) {
    tableroElement.querySelectorAll('.celdas-sudoku').forEach(celda => {
        if (celda.value === '0') {
            ocultarCelda(celda);  // Llamar a la función de ocultar celda para vaciar la celda
        }
    });
}

// // Función para ocultar celdas asegurando una única solución
// function ocultarNumerosConUnicaSolucion(tablero, numOcultos) {
//     // Genera una copia del tablero para no modificar el original
//     let tableroModificado = JSON.parse(JSON.stringify(tablero));

//     let celdas = [];
//     for (let fila = 0; fila < 9; fila++) {
//         for (let columna = 0; columna < 9; columna++) {
//             celdas.push([fila, columna]);
//         }
//     }
//     celdas = celdas.sort(() => Math.random() - 0.5); // Mezclar celdas aleatoriamente

//     let celdasEliminadas = 0;

//     for (let [fila, columna] of celdas) {
//         if (celdasEliminadas >= numOcultos) break;

//         let valorOriginal = tableroModificado[fila][columna];
//         tableroModificado[fila][columna] = 0;  // Ocultar la celda

//         // Verificar si el tablero sigue teniendo una única solución
//         if (!tieneUnicaSolucion(tableroModificado)) {
//             tableroModificado[fila][columna] = valorOriginal;  // Restaurar si hay múltiples soluciones
//         } else {
//             celdasEliminadas++;
//         }
//     }

//     return tableroModificado;  // Devolver el tablero modificado con celdas ocultas
// }


// Verificar si el tablero tiene una única solución
function tieneUnicaSolucion(tablero) {
    let soluciones = 0;

    function resolver(tablero) {
        for (let fila = 0; fila < 9; fila++) {
            for (let columna = 0; columna < 9; columna++) {
                if (tablero[fila][columna] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (validarFilColum(tablero, fila, columna, num)) {
                            tablero[fila][columna] = num;
                            if (resolver(tablero)) return true;
                            tablero[fila][columna] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        soluciones++;
        return soluciones === 1;  // Devuelve true si se encontró una única solución
    }

    resolver(JSON.parse(JSON.stringify(tablero)));
    return soluciones === 1;
}

// Función principal para generar los tableros
async function generarTableros() {
    const modalidadesDificultad = ['FACIL', 'MEDIO', 'DIFICIL', 'EXPERTO', 'EXTREMO'];
    const numTableros = 2;
    const maxTiempo = 500; // tiempo en milisegundos

    const tableros = [];

    for (let i = 0; i < numTableros; i++) {
        let original;
        do {
            original = generarSudoku();
        } while (original === null);

        let tablerosPorModalidad = {};

        for (let dificultad of modalidadesDificultad) {
            let numOcultos = modalidades(dificultad);
            const tiempoInicio = performance.now();

            let tableroConCeldasOcultas = ocultarNumerosConUnicaSolucion(original, numOcultos);

            const tiempoFin = performance.now();
            const tiempoEjecucion = tiempoFin - tiempoInicio;

            if (tiempoEjecucion > maxTiempo) {
                console.error(`Tiempo de ocultación para modalidad ${dificultad} excedió el límite de ${maxTiempo} ms.`);
                return;
            }

            tablerosPorModalidad[dificultad] = tableroConCeldasOcultas;
        }

        tableros.push(tablerosPorModalidad);
    }

    return tableros;
}

/* Prueba de para ver que está todo en orden */
// Función para mostrar el Sudoku generado en la interfaz
function printSudoku(board) {
    for (let row = 0; row < 9; row++) {
        if (row % 3 === 0 && row !== 0) {
            console.log("- - - - - - - - - - - - -");
        }
        let line = "";
        for (let col = 0; col < 9; col++) {
            if (col % 3 === 0 && col !== 0) {
                line += " | ";
            }
            line += board[row][col] === 0 ? " " : board[row][col];
            line += " ";
        }
        console.log(line);
    }
}

// Acceso global
window.generarSudoku = generarSudoku;
window.printSudoku = printSudoku;