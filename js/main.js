// js/main.js
import { renderMemoria } from './memoria.js';
import { renderAhorcado } from './ahorcado.js';
import { renderTriqui } from './triqui.js';

const appContainer = document.getElementById('app');
let deferredPrompt;
let appState = { step: 'welcome' };

// 1. DETECCIÓN DE DISPOSITIVO
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// 2. NAVEGADOR PRINCIPAL
function navigate() {
    appContainer.innerHTML = '';
    switch (appState.step) {
        case 'welcome': renderWelcome(); break;
        case 'notifications': renderNotifications(); break;
        case 'ads': renderAds(); break;
        case 'home': renderHome(); break;
    }
}

// 3. PANTALLAS INICIALES
function renderWelcome() {
    appContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <h1 class="text-5xl font-extrabold text-blue-800 mb-6 animate-bounce">Mente Activa 🧠</h1>
            <p class="text-2xl text-gray-600 mb-10">Tu compañero diario para una mente fuerte.</p>
            <button id="btn-start" class="bg-blue-600 text-white text-2xl px-12 py-5 rounded-full shadow-2xl active:scale-95 transition-transform font-bold">Comenzar</button>
        </div>`;
    document.getElementById('btn-start').onclick = () => { appState.step = 'notifications'; navigate(); };
}

function renderNotifications() {
    appContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white">
            <div class="text-7xl mb-6">🔔</div>
            <h2 class="text-3xl font-bold mb-4 text-blue-900">Recordatorios</h2>
            <p class="text-xl text-gray-500 mb-8">¿Quieres avisos para tus ejercicios diarios?</p>
            <button id="btn-allow" class="bg-green-600 text-white w-full max-w-sm py-4 rounded-xl text-xl font-bold mb-4 shadow-lg">Sí, permitir</button>
            <button id="btn-skip" class="text-gray-400 text-lg underline">Luego</button>
        </div>`;
    const next = () => { appState.step = 'ads'; navigate(); };
    document.getElementById('btn-allow').onclick = () => {
        if ("Notification" in window) Notification.requestPermission().then(next);
        else next();
    };
    document.getElementById('btn-skip').onclick = next;
}

function renderAds() {
    appContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
            <div class="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm border-2 border-orange-200">
                <h2 class="text-2xl font-bold text-orange-600 mb-4">Aviso</h2>
                <p class="text-gray-600 mb-6 text-lg">Esta app es gratuita gracias a la publicidad.</p>
                <button id="btn-accept-ads" class="bg-orange-500 text-white w-full py-4 rounded-xl text-xl font-bold shadow-md">Entendido</button>
            </div>
        </div>`;
    document.getElementById('btn-accept-ads').onclick = () => { appState.step = 'home'; navigate(); checkPwaInstallation(); };
}

// 4. HOME (MENÚ DE JUEGOS)
export function renderHome() {
    appContainer.innerHTML = `
        <div class="p-6 min-h-screen bg-blue-50">
            <header class="flex justify-between items-center mb-8 bg-white p-5 rounded-2xl shadow-sm border-b-2 border-blue-100">
                <h1 class="text-2xl font-black text-blue-900 uppercase">Mente Activa</h1>
                <span class="bg-blue-600 text-white px-4 py-1 rounded-full font-bold">Nivel 1</span>
            </header>

            <div class="grid grid-cols-2 gap-5">
                <div id="btn-memoria" class="bg-white p-6 rounded-[2rem] shadow-md text-center cursor-pointer border-b-8 border-blue-400 active:translate-y-1 active:border-b-0 transition-all">
                    <span class="text-6xl block mb-2">🃏</span>
                    <span class="font-black text-blue-900">MEMORIA</span>
                </div>

                <div id="btn-ahorcado" class="bg-white p-6 rounded-[2rem] shadow-md text-center cursor-pointer border-b-8 border-orange-400 active:translate-y-1 active:border-b-0 transition-all">
                    <span class="text-6xl block mb-2">🪑</span>
                    <span class="font-black text-orange-900">AHORCADO</span>
                </div>

                <div id="btn-triqui" class="bg-white p-6 rounded-[2rem] shadow-md text-center cursor-pointer border-b-8 border-purple-400 active:translate-y-1 active:border-b-0 transition-all">
                    <span class="text-6xl block mb-2">❌</span>
                    <span class="font-black text-purple-900">TRIQUI</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btn-memoria').onclick = () => renderMemoria(appContainer, renderHome);
    document.getElementById('btn-ahorcado').onclick = () => renderAhorcado(appContainer, renderHome);
    document.getElementById('btn-triqui').onclick = () => renderTriqui(appContainer, renderHome);
}

// 5. LÓGICA DE INSTALACIÓN (PWA)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

function checkPwaInstallation() {
    if (isInStandaloneMode()) return; // Si ya está instalada, no molestar

    setTimeout(() => {
        if (isIos()) {
            showIosBanner();
        } else if (deferredPrompt) {
            showAndroidBanner();
        }
    }, 2000);
}

function showAndroidBanner() {
    const banner = document.createElement('div');
    banner.className = 'fixed bottom-4 left-4 right-4 bg-blue-700 text-white p-6 rounded-3xl shadow-2xl z-[100] animate-bounce';
    banner.innerHTML = `
        <p class="text-lg font-bold mb-4 text-center">¿Quieres guardar esta app en tu celular? 📱</p>
        <button id="pwa-install-btn" class="bg-white text-blue-700 w-full py-3 rounded-xl font-bold mb-2">INSTALAR AHORA</button>
        <button id="pwa-close-btn" class="w-full text-blue-200 text-sm">Tal vez luego</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-install-btn').onclick = async () => {
        banner.remove();
        deferredPrompt.prompt();
        deferredPrompt = null;
    };
    document.getElementById('pwa-close-btn').onclick = () => banner.remove();
}

function showIosBanner() {
    const banner = document.createElement('div');
    banner.className = 'fixed bottom-4 left-4 right-4 bg-white text-gray-800 p-6 rounded-3xl shadow-2xl z-[100] border-t-4 border-blue-500';
    banner.innerHTML = `
        <p class="font-bold text-center mb-4">Para instalar en tu iPhone: 📱</p>
        <ol class="text-sm space-y-2 mb-4">
            <li>1. Toca el botón <strong>Compartir</strong> (cuadrado con flecha abajo).</li>
            <li>2. Baja y toca en <strong>'Añadir a pantalla de inicio'</strong>.</li>
        </ol>
        <button id="pwa-ios-close" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">ENTENDIDO</button>
    `;
    document.body.appendChild(banner);
    document.getElementById('pwa-ios-close').onclick = () => banner.remove();
}

navigate();
