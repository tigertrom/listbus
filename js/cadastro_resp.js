/**
 * cadastro_resp.js
 * 
 * Busca responsáveis (maiores de idade) diretamente do Firebase
 * Mostra apenas o nome completo para proteger dados sensíveis
 */

/**
 * Busca passageiros maiores de idade no Firebase e popula o select
 * Exibe apenas nome completo, ocultando email, telefone e outros dados
 */
async function carregarResponsaveisDoFirebase() {
    const responsavelSelect = document.getElementById('responsavel');
    if (!responsavelSelect) return;
    
    // Limpa e adiciona opção padrão
    responsavelSelect.innerHTML = '<option value="">Selecione o Responsável</option>';
    
    try {
        const snapshot = await db.collection('passageiros')
            .orderBy('nome')
            .get();
        
        snapshot.forEach(doc => {
            const passageiro = doc.data();
            
            // Verifica se tem data de nascimento
            if (passageiro.dataNascimento) {
                const dataNasc = passageiro.dataNascimento.toDate ? 
                    passageiro.dataNascimento.toDate() : 
                    new Date(passageiro.dataNascimento);
                
                const idade = calcularIdade(dataNasc);
                
                // Apenas maiores de idade
                if (idade >= 18) {
                    const option = document.createElement('option');
                    
                    // Guarda o ID do documento como valor (para referência no banco)
                    option.value = doc.id;
                    
                    // Mostra APENAS o nome completo (protege dados sensíveis)
                    const nomeCompleto = `${passageiro.nome} ${passageiro.sobrenome}`;
                    option.textContent = nomeCompleto;
                    
                    // Guarda dados internamente (não visíveis ao usuário)
                    // mas necessários para salvar o vínculo corretamente
                    option.dataset.nome = passageiro.nome;
                    option.dataset.sobrenome = passageiro.sobrenome;
                    option.dataset.idResponsavel = doc.id;
                    
                    responsavelSelect.appendChild(option);
                }
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar responsáveis:', error);
        responsavelSelect.innerHTML = '<option value="">Erro ao carregar responsáveis</option>';
    }
}

// Evento de mudança na data de nascimento
document.addEventListener('DOMContentLoaded', function() {
    const dataNascInput = document.getElementById('dataNascimento');
    const responsavelSection = document.getElementById('responsavelSection');
    
    if (dataNascInput && responsavelSection) {
        dataNascInput.addEventListener('change', async function() {
            const dataNasc = new Date(this.value);
            const idade = calcularIdade(dataNasc);
            
            if (idade < 18) {
                // Mostra seção de responsável
                responsavelSection.style.display = 'block';
                
                const responsavelSelect = document.getElementById('responsavel');
                if (responsavelSelect) {
                    responsavelSelect.setAttribute('required', 'required');
                }
                
                // Busca do Firebase (sempre dados atualizados)
                await carregarResponsaveisDoFirebase();
                
            } else {
                // Esconde seção de responsável
                responsavelSection.style.display = 'none';
                
                const responsavelSelect = document.getElementById('responsavel');
                if (responsavelSelect) {
                    responsavelSelect.removeAttribute('required');
                    responsavelSelect.value = '';
                }
            }
        });
    }
});
