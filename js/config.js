// ==========================================
// CONFIGURAÇÕES GLOBAIS - config.js
// ==========================================

// CONFIGURAÇÃO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyAB7cZcS77JnchllAtITu1JS2tMDLON8SI",
    authDomain: "listbus-b5570.firebaseapp.com",
    projectId: "listbus-b5570",
    storageBucket: "listbus-b5570.firebasestorage.app",
    messagingSenderId: "661871396138",
    appId: "1:661871396138:web:1f884a4df8cc75390e4a53",
    measurementId: "G-RV0R8LM73P"
};

// CONFIGURAÇÃO EMAILJS
const EMAILJS_CONFIG = {
    PUBLIC_KEY: "yAhHSrw1TBS9kzOBr",
    SERVICE_ID: "service_ikc4rr8",
    TEMPLATE_ID: "template_xqafz91",           // Template de cadastro/Confirmação
    TEMPLATE_CHANGE_ID: "template_mre74xq"     // Template de alteração de assento
};

// Inicializar Firebase (disponível globalmente)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Inicializar EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
})();
