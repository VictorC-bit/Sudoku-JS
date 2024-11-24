let tableros = {};

async function generarYGuardarTableros() {
    try {
        // Aquí llamamos a la función que genera los tableros
        const tableros = await generarTableros();
        console.log(tableros);
    } catch (error) {
        console.error('Error en la generación y almacenamiento de tableros:', error);
    }
}

// Función para cargar un tablero desde el archivo JSON en función de la dificultad
async function cargarTablero(dificultad) {
    try {
        // Cargar el archivo JSON desde la ruta relativa
        const response = await fetch('JSON/hiddenBoard.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const tableros = await response.json();
        
        // Obtener los tableros según la dificultad seleccionada
        const tablerosPorDificultad = tableros[dificultad];
        if (!tablerosPorDificultad) {
            throw new Error('Dificultad no encontrada');
        }

        // Seleccionar un tablero aleatorio
        return tablerosPorDificultad[Math.floor(Math.random() * tablerosPorDificultad.length)];
    } catch (error) {
        console.error('Error al cargar el tablero:', error);
        mostrarModal('No hay tablero disponible', 'error');
    }
}

// Hacer la función accesible globalmente
window.generarYGuardarTableros = generarYGuardarTableros;