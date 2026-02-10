// js/memoria.js

export function renderMemoria(container, onBack) {
    const iconos = ['🍎', '🍌', '🍇', '🍓', '🥑', '🥦', '🥕', '🌽'];
    // Duplicamos los iconos para crear parejas y los mezclamos
    let cartas = [...iconos, ...iconos].sort(() => Math.random() - 0.5);
    
    let volteadas = [];
    let emparejadas = [];
    let bloqueado = false;

    const actualizarVista = () => {
        container.innerHTML = `
            <div class="p-6 flex flex-col items-center min-h-screen bg-blue-50">
                <div class="w-full max-w-md flex justify-between items-center mb-6">
                    <button id="back-btn" class="text-blue-700 font-bold text-xl px-4 py-2 bg-white rounded-lg shadow">← Volver</button>
                    <div class="text-blue-800 font-bold">Parejas: ${emparejadas.length / 2} / ${iconos.length}</div>
                </div>

                <h2 class="text-3xl font-extrabold text-blue-900 mb-8 text-center">Encuentra las Parejas</h2>
                
                <div id="tablero" class="grid grid-cols-4 gap-3 w-full max-w-md">
                    ${cartas.map((icono, indice) => {
                        const estaVolteada = volteadas.some(c => c.indice === indice);
                        const estaEmparejada = emparejadas.includes(indice);
                        
                        return `
                            <div 
                                data-indice="${indice}"
                                class="card-btn h-24 flex items-center justify-center text-4xl rounded-2xl cursor-pointer transition-all duration-300 shadow-md
                                ${estaVolteada || estaEmparejada 
                                    ? 'bg-white rotate-0 border-4 border-blue-400' 
                                    : 'bg-blue-600 rotate-180 shadow-lg'}"
                            >
                                ${(estaVolteada || estaEmparejada) ? icono : '?'}
                            </div>
                        `;
                    }).join('')}
                </div>

                ${emparejadas.length === cartas.length ? `
                    <div class="fixed inset-0 bg-blue-900/80 flex flex-col items-center justify-center p-6 text-center z-50">
                        <div class="bg-white p-10 rounded-3xl shadow-2xl">
                            <h3 class="text-5xl mb-4">🏆</h3>
                            <h3 class="text-4xl font-bold text-blue-900 mb-2">¡Excelente Trabajo!</h3>
                            <p class="text-gray-600 text-xl mb-8">Has ejercitado tu memoria visual perfectamente.</p>
                            <button onclick="location.reload()" class="bg-blue-600 text-white px-10 py-4 rounded-full text-2xl font-bold">Jugar de nuevo</button>
                        </div>
                    </div>` : ''}
            </div>
        `;

        // Asignar eventos a las cartas
        document.getElementById('back-btn').onclick = onBack;
        document.querySelectorAll('.card-btn').forEach(card => {
            card.onclick = () => {
                const indice = parseInt(card.getAttribute('data-indice'));
                manejarClick(indice);
            };
        });
    };

    const manejarClick = (indice) => {
        // Evitar clics si está bloqueado, si la carta ya está volteada o si ya fue emparejada
        if (bloqueado || volteadas.some(c => c.indice === indice) || emparejadas.includes(indice)) return;

        volteadas.push({ indice, icono: cartas[indice] });
        actualizarVista();

        if (volteadas.length === 2) {
            bloqueado = true;
            const [c1, c2] = volteadas;

            if (c1.icono === c2.icono) {
                emparejadas.push(c1.indice, c2.indice);
                volteadas = [];
                bloqueado = false;
                actualizarVista();
            } else {
                // Si no coinciden, dar un segundo para memorizar y voltear de nuevo
                setTimeout(() => {
                    volteadas = [];
                    bloqueado = false;
                    actualizarVista();
                }, 1000);
            }
        }
    };

    actualizarVista();
}
