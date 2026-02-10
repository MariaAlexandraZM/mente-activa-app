// js/ahorcado.js

export function renderAhorcado(container, onBack) {
    // Lista de palabras temáticas (objetos, hogar, naturaleza)
    const PALABRAS = [
        { p: "CASA", pista: "Lugar donde vivimos" },
        { p: "MESA", pista: "Mueble para comer" },
        { p: "RADIO", pista: "Se usa para escuchar música" },
        { p: "RELOJ", pista: "Sirve para ver la hora" },
        { p: "FLOR", pista: "Parte colorida de las plantas" },
        { p: "SOL", pista: "Nos da luz y calor" },
        { p: "GATO", pista: "Mascota que hace miau" },
        { p: "LIBRO", pista: "Se usa para leer" }
    ];

    // Selección aleatoria
    let seleccionada = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
    let palabra = seleccionada.p;
    let pista = seleccionada.pista;
    
    let adivinadas = [];
    let errores = 0;
    const maxErrores = 6;

    const actualizarVista = () => {
        const palabraMostrada = palabra.split('').map(letra => 
            adivinadas.includes(letra) ? letra : "_"
        ).join(" ");

        const haGanado = !palabraMostrada.includes("_");
        const haPerdido = errores >= maxErrores;

        container.innerHTML = `
            <div class="p-6 flex flex-col items-center min-h-screen bg-orange-50">
                <div class="w-full max-w-md flex justify-between items-center mb-6">
                    <button id="back-btn" class="text-orange-700 font-bold text-xl px-4 py-2 bg-white rounded-lg shadow">← Volver</button>
                    <div class="text-orange-800 font-bold">Errores: <span class="${errores > 4 ? 'text-red-600' : ''}">${errores}/${maxErrores}</span></div>
                </div>

                <h2 class="text-3xl font-extrabold text-orange-900 mb-2">Adivina la palabra</h2>
                <p class="text-orange-700 italic mb-8 text-lg text-center">Pista: ${pista}</p>
                
                <div class="text-5xl font-mono tracking-[0.3em] mb-12 text-gray-800 bg-white p-6 rounded-2xl shadow-inner border-2 border-orange-200">
                    ${palabraMostrada}
                </div>
                
                <div id="teclado" class="grid grid-cols-4 sm:grid-cols-7 gap-2 w-full max-w-md mb-8">
                    ${"ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('').map(letra => {
                        const usada = adivinadas.includes(letra);
                        return `
                            <button 
                                class="letra-btn text-xl font-bold p-4 rounded-xl shadow-sm transition-all 
                                ${usada ? 'bg-gray-300 text-gray-500' : 'bg-white text-orange-700 active:bg-orange-500 active:text-white border-b-4 border-orange-200'}"
                                ${usada || haGanado || haPerdido ? 'disabled' : ''}
                                data-letra="${letra}"
                            >
                                ${letra}
                            </button>
                        `;
                    }).join('')}
                </div>

                ${haGanado ? `
                    <div class="fixed inset-0 bg-green-600/90 flex flex-col items-center justify-center p-6 text-center z-50">
                        <h3 class="text-5xl font-bold text-white mb-4">¡Excelente! 🎉</h3>
                        <p class="text-white text-2xl mb-8">Has adivinado la palabra correctamente.</p>
                        <button onclick="location.reload()" class="bg-white text-green-700 px-10 py-4 rounded-full text-2xl font-bold shadow-xl">Jugar otra vez</button>
                    </div>` : ''}

                ${haPerdido ? `
                    <div class="fixed inset-0 bg-red-600/90 flex flex-col items-center justify-center p-6 text-center z-50">
                        <h3 class="text-4xl font-bold text-white mb-4">¡No te rindas!</h3>
                        <p class="text-white text-xl mb-4">La palabra era: <span class="text-yellow-300">${palabra}</span></p>
                        <p class="text-white text-lg mb-8">Cada error es una oportunidad para aprender.</p>
                        <button onclick="location.reload()" class="bg-white text-red-700 px-10 py-4 rounded-full text-2xl font-bold shadow-xl">Intentar de nuevo</button>
                    </div>` : ''}
            </div>
        `;

        // Asignar eventos de nuevo tras cada render
        document.getElementById('back-btn').onclick = onBack;
        document.querySelectorAll('.letra-btn').forEach(btn => {
            btn.onclick = () => {
                const L = btn.getAttribute('data-letra');
                if (!adivinadas.includes(L)) {
                    adivinadas.push(L);
                    if (!palabra.includes(L)) errores++;
                    actualizarVista();
                }
            };
        });
    };

    actualizarVista();
}
