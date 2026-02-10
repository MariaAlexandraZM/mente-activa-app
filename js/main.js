import { renderMemoria } from './memoria.js';

function openGame(name) {
    const app = document.getElementById('app');
    if (name === 'Memoria') {
        renderMemoria(app, () => renderHome());
    }
}
