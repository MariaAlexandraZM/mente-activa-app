// js/memoria.js

export function renderMemoria(container, onBack) {
    const iconos = ['🍎', '🍌', '🍇', '🍓', '🥑', '🥦', '🥕', '🌽'];
    // Parejas mezcladas
    let cartas = [...iconos, ...iconos].sort(() => Math.random() - 0.5);
    
    let volteadas = [];
    let emparejadas = [];
    let bloqueado = false;

    const actualizarVista = () => {
        const haGanado = emparejadas.length === cartas.length;

        container.innerHTML = `
            <div class="p-6 flex flex-col items-center min-h-screen bg-blue-50">
                <div class="w-full max-w-md flex justify-between items-center mb-6">
                    <button id="back-btn-top" class="text-blue-700 font-bold text-lg px-4 py-2 bg-white rounded-lg shadow">← Volver</button>
                    <div class="text-blue-800 font-bold">Parejas: ${emparejadas.length / 2} / ${iconos.length}</div>
                </div>

                <h2 class="text-2xl font-black text-blue-900 mb-6 text-center uppercase tracking-tight">Memoria Visual</h2>
                
                <div id="tablero" class="grid grid-cols-4 gap-3 w-full max-w-md">
                    ${cartas.map((icono, indice) => {
                        const estaVolteada = volteadas.some(c => c.indice === indice);
                        const estaEmparejada = emparejadas.includes(indice);
                        
                        return `
                            <div 
                                data-indice="${indice}"
                                class="card-btn h-20 sm:h-24 flex items-center justify-center text-3xl rounded-2xl cursor-pointer transition-all duration-300 shadow-md
                                ${estaVolteada || estaEmparejada 
                                    ? 'bg-white rotate-0 border-4 border-blue-400' 
                                    : 'bg-blue-600 rotate-180 shadow-lg active:scale-90'}"
                            >
                                ${(estaVolteada || estaEmparejada) ? icono : '?'}
                            </div>
                        `;
                    }).join('')}
                </div>

                ${haGanado ? `
                    <div class="fixed inset-0 bg-blue-900/90 flex flex-col items-center justify-center p-6 text-center z-50">
                        <div class="bg-white p-10 rounded-[3rem] shadow-2xl scale-110">
                            <h3 class="text-6xl mb-4">🏆</h3>
                            <h3 class="text-3xl font-black text-blue-900 mb-2">¡LO LOGRASTE!</h3>
                            <p class="text-gray-600 text-lg mb-8 font-medium">Tu memoria está funcionando de maravilla.</p>
                            <button id="btn-win-home" class="bg-blue-600 text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg active:bg-blue-700">Ir al Menú</button>
                        </div>
                    </div>` : ''}
            </div>
        `;

        // ASIGNACIÓN DE EVENTOS
        document.getElementById('back-btn-top').onclick = onBack;
        
        if (haGanado) {
            document.getElementById('btn-win-home').onclick = onBack;
        }

        document.querySelectorAll('.card-btn').forEach(card => {
            card.onclick = () => {
                const indice = parseInt(card.getAttribute('data-indice'));
                manejarClick(indice);
            };
        });
    };

    const manejarClick = (indice) => {
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
                setTimeout(() => {
                    volteadas = [];
                    bloqueado = false;
                    actualizarVista();
                }, 800); // Un poco más rápido para no desesperar al usuario
            }
        }
    };

    actualizarVista();
}
