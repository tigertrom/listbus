// ==========================================
// FUNÇÕES DE AUTENTICAÇÃO - auth.js
// ==========================================

// Verificar se email é admin
async function checkIfAdmin(email) {
    try {
        const adminDoc = await db.collection('admins_listbusy').doc(email).get();
        if (adminDoc.exists) {
            const data = adminDoc.data();
            return data.regra === 'admin' || data.regra === 'administrador';
        }
        return false;
    } catch (error) {
        console.error('Erro ao verificar admin:', error);
        return false;
    }
}

// Login com Google
async function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        const isAdminUser = await checkIfAdmin(user.email);
        
        if (!isAdminUser) {
            await auth.signOut();
            alert(`O email ${user.email} não tem permissão de administrador.`);
            return null;
        }

        return user;
        
    } catch (error) {
        let errorMessage = 'Erro ao fazer login com Google.';
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Login cancelado. Você fechou a janela do Google.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Popup bloqueado pelo navegador. Permita popups para este site.';
        }
        alert(errorMessage);
        return null;
    }
}

// Logout
async function logoutAdmin() {
    try {
        await auth.signOut();
        window.location.href = 'index.html'; // Redireciona para página inicial
    } catch (error) {
        console.error('Erro ao sair:', error);
    }
}

// Verificar autenticação ao carregar página admin
function checkAuthState(callback) {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const isAdmin = await checkIfAdmin(user.email);
            if (isAdmin) {
                callback(user);
            } else {
                // Não é admin, redireciona
                window.location.href = 'index.html';
            }
        } else {
            // Não está logado, redireciona
            window.location.href = 'index.html';
        }
    });
}
