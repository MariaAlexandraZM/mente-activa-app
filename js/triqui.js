//
// js/triqui.js

export function renderTriqui(container, onBack) {
    let board = Array(9).fill(null);
    let isGameActive = true;
    let statusMsg = "Tu turno (X)";

    const WIN_COMBOS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    const checkWinner = (tempBoard) => {
        for (let combo of WIN_COMBOS) {
            const [a, b, c] = combo;
            if (tempBoard[a] && tempBoard[a] === tempBoard[b] && tempBoard[a] === tempBoard[c]) {
                return tempBoard[a];
            }
        }
        return tempBoard.includes(null) ? null : "TIE";
    };

    const computerMove = () => {
        if (!isGameActive) return;
        
        // 1. Intentar ganar o bloquear (IA simple)
        let availableMoves = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
        
        // Elegir un movimiento aleatorio
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        
        if (randomMove !== undefined) {
            board[randomMove] = "O";
            const winner = checkWinner(board);
            if (winner) {
                isGameActive = false;
                statusMsg = winner === "O" ? "¡Ganó la máquina!" : "¡Empate!";
            } else {
                statusMsg = "Tu turno (X)";
            }
            actualizarVista();
        }
    };

    const handleSquareClick = (index) => {
        if (board[index] || !isGameActive) return;

        board[index] = "X";
        const winner = checkWinner(board);

        if (winner) {
            isGameActive = false;
            statusMsg = winner === "X" ? "¡Ganaste! 🎉" : "¡Empate!";
            actualizarVista();
        } else {
            statusMsg = "Pensando...";
            actualizarVista();
            setTimeout(computerMove, 600);
        }
    };

    const actualizarVista = () => {
        const gameOver = !isGameActive;

        container.innerHTML = `
            <div class="p-6 flex flex-col items-center min-h-screen bg-purple-50">
                <div class="w-full max-w-md flex justify-between items-center mb-6">
                    <button id="back-btn-top" class="text-purple-700 font-bold text-lg px-4 py-2 bg-white rounded-lg shadow">← Volver</button>
                </div>

                <h2 class="text-3xl font-black text-purple-900 mb-2">Triqui</h2>
                <p class="text-purple-700 font-bold mb-8 text-xl">${statusMsg}</p>

                <div class="grid grid-cols-3 gap-3 w-full max-w-[300px]">
                    ${board.map((cell, i) => `
                        <div 
                            data-index="${i}"
                            class="square h-24 bg-white border-b-4 border-purple-200 rounded-2xl flex items-center justify-center text-5xl font-bold shadow-md active:scale-95 transition-all
                            ${cell === 'X' ? 'text-blue-600' : 'text-red-500'}"
                        >
                            ${cell || ''}
                        </div>
                    `).join('')}
                </div>

                ${gameOver ? `
                    <div class="fixed inset-0 bg-purple-900/90 flex flex-col items-center justify-center p-6 text-center z-50">
                        <div class="bg-white p-10 rounded-[3rem] shadow-2xl">
                            <h3 class="text-4xl font-black text-purple-900 mb-6">${statusMsg}</h3>
                            <button id="btn-win-home" class="bg-purple-600 text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg">Ir al Menú</button>
                        </div>
                    </div>` : ''}
            </div>
        `;

        document.getElementById('back-btn-top').onclick = onBack;
        if (gameOver) document.getElementById('btn-win-home').onclick = onBack;

        document.querySelectorAll('.square').forEach(sq => {
            sq.onclick = () => handleSquareClick(sq.getAttribute('data-index'));
        });
    };

    actualizarVista();
}
