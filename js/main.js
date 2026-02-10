// js/main.js
import { renderMemoria } from './memoria.js';
import { renderAhorcado } from './ahorcado.js';

console.log("Main.js cargado correctamente");

const appContainer = document.getElementById('app');

// Estado inicial de la aplicación
let appState = {
    step: 'welcome' // welcome, notifications, ads, home
};

// Función principal de navegación
function navigate() {
    appContainer.innerHTML = ''; // Limpiar pantalla

    switch (appState.step) {
        case 'welcome':
            renderWelcome();
            break;
        case 'notifications':
            renderNotifications();
            break;
        case 'ads':
            renderAds();
            break;
        case 'home':
            renderHome();
            break;
    }
}

// 1. Pantalla de Bienvenida
function renderWelcome() {
    appContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <h1 class="text-5xl font-extrabold text-blue-800 mb-6 animate-bounce">Mente Activa 🧠</h1>
            <p class="text-2xl text-gray-600 mb-10">Tu compañero diario para una mente fuerte y ágil.</p>
            <button id="btn-start" class="bg-blue-600 text-white text-2xl px-12 py-5 rounded-full shadow-2xl active:scale-95 transition-transform">
                Comenzar ahora
            </button>
        </div>`;
    
    document.getElementById('btn-start').onclick = () => {
        appState.step = 'notifications';
        navigate();
    };
}

// 2. Pantalla de Notificaciones
function renderNotifications() {
    appContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white">
            <div class="text-7xl mb-6">🔔</div>
            <h2 class="text-3xl font-bold mb-4 text-blue-900">Mantente al día</h2>
            <p class="text-xl text-gray-500 mb-8">¿Nos permites enviarte recordatorios para tus ejercicios diarios?</p>
            <button id="btn-allow" class="bg-green-600 text-white w-full max-w-sm py-4 rounded-xl text-xl font-bold mb-4 shadow-lg">Permitir</button>
            <button id="btn-skip-notif" class="text-gray-400 text-lg underline">Ahora no</button>
        </div>`;

    const next = () => { appState.step = 'ads'; navigate(); };
    
    document.getElementById('btn-allow').onclick = () => {
        if ("Notification" in window) {
            Notification.requestPermission().then(next);
        } else { next(); }
    };
    document.getElementById('btn-skip-notif').onclick = next;
}

// 3. Pantalla de Publicidad
function renderAds() {
    appContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
            <div class="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm border-2 border-orange-200">
                <h2 class="text-2xl font-bold text-orange-600 mb-4">Aviso de Sostenibilidad</h2>
                <p class="text-gray-600 mb-6 text-lg font-medium">Para ofrecerte estos juegos gratis, verás algunos anuncios publicitarios.</p>
                <button id="btn-accept-ads" class="bg-orange-500 text-white w-full py-4 rounded-xl text-xl font-bold shadow-md active:bg-orange-600">Entendido y Continuar</button>
            </div>
        </div>`;
    
    document.getElementById('btn-accept-ads').onclick = () => {
        appState.step = 'home';
        navigate();
    };
}

// 4. Pantalla Principal (Mosaico de Juegos)
export function renderHome() {
    appContainer.innerHTML = `
        <div class="p-6 min-h-screen bg-blue-50">
            <header class="flex justify-between items-center mb-8 bg-white p-5 rounded-2xl shadow-sm border-b-2 border-blue-100">
                <h1 class="text-2xl font-black text-blue-900">Mente Activa</h1>
                <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-blue-600 uppercase">Nivel</span>
                    <span class="bg-blue-600 text-white px-3 py-1 rounded-full font-bold">1</span>
                </div>
            </header>

            <div class="grid grid-cols-2 gap-5">
                <div id="btn-memoria" class="bg-white p-6 rounded-[2rem] shadow-md text-center cursor-pointer border-b-8 border-blue-400 active:translate-y-1 active:border-b-0 transition-all">
                    <span class="text-6xl block mb-2">🃏</span>
                    <span class="font-black text-blue-900 uppercase tracking-tighter">Memoria</span>
                </div>

                <div id="btn-ahorcado" class="bg-white p-6 rounded-[2rem] shadow-md text-center cursor-pointer border-b-8 border-orange-400 active:translate-y-1 active:border-b-0 transition-all">
                    <span class="text-6xl block mb-2">🪑</span>
                    <span class="font-black text-orange-900 uppercase tracking-tighter">Ahorcado</span>
                </div>

                <div class="bg-gray-200 p-6 rounded-[2rem] shadow-inner text-center opacity-60 relative overflow-hidden">
                    <span class="text-6xl block mb-2 grayscale">❌</span>
                    <span class="font-bold text-gray-500">Triqui</span>
                    <div class="absolute top-2 right-4 text-2xl">🔒</div>
                </div>

                <div class="bg-gray-200 p-6 rounded-[2rem] shadow-inner text-center opacity-60 relative overflow-hidden">
                    <span class="text-6xl block mb-2 grayscale">📝</span>
                    <span class="font-bold text-gray-500">Stop</span>
                    <div class="absolute top-2 right-4 text-2xl">🔒</div>
                </div>
            </div>
            
            <p class="mt-12 text-center text-blue-400 font-medium italic italic">"Una mente activa es una vida saludable"</p>
        </div>
    `;

    // Eventos de los juegos
    document.getElementById('btn-memoria').onclick = () => renderMemoria(appContainer, renderHome);
    document.getElementById('btn-ahorcado').onclick = () => renderAhorcado(appContainer, renderHome);
}

// Iniciar aplicación
navigate();
