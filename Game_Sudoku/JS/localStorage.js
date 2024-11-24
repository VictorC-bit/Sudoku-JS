// Obtener Sudoku
function obtenerSudoku() {
    return localStorage.getItem('sudokuTablero') ? JSON.parse(localStorage.getItem('sudokuTablero')) : null;
}

// Guardad Sudoku
function guardarSudoku(sudoku) {
    localStorage.setItem('sudokuTablero', JSON.stringify(sudoku));
}

// Eliminar Sudoku
function eliminarSudoku() {
    localStorage.removeItem('sudokuTablero');
}

// Acceso global
window.obtenerSudoku = obtenerSudoku;
window.guardarSudoku = guardarSudoku;
window.eliminarSudoku = eliminarSudoku;