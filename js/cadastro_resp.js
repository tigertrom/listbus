/**
 * cadastro_resp.js
 * 
 * Busca responsáveis na coleção pública (apenas nome e sobrenome)
 * Dados sensíveis permanecem protegidos na coleção principal
 */

/**
 * Busca passageiros maiores de idade na coleção pública
 */
async function carregarResponsaveisDoFirebase() {
    const responsavelSelect = document.getElementById('responsavelSelect');
    if (!responsavelSelect) return;
    
    // Limpa e adiciona opção padrão
    responsavelSelect.innerHTML = '<option value="">-- Selecione um responsável --</option>';
    
    try {
        console.log('Buscando responsáveis na coleção pública...');
        
        // Busca na coleção PÚBLICA (volunteers_publico)
        const snapshot = await db.collection('volunteers_publico')
            .orderBy('firstName')
            .get();
        
        let count = 0;
        
        snapshot.forEach(doc => {
            const dados = doc.data();
            
            // Apenas maiores de idade (idade >= 18)
            if (dados.age >= 18) {
                const option = document.createElement('option');
                option.value = doc.id; // ID vincula ao documento principal
                option.textContent = `${dados.firstName} ${dados.lastName}`;
                responsavelSelect.appendChild(option);
                count++;
            }
        });
        
        console.log(`${count} responsáveis carregados`);
        
    } catch (error) {
        console.error('Erro ao buscar responsáveis:', error);
        responsavelSelect.innerHTML = '<option value="">Erro ao carregar responsáveis</option>';
    }
}

// Evento de mudança na data de nascimento
document.addEventListener('DOMContentLoaded', function() {
    const dataNascInput = document.getElementById('birthDate');
    const responsavelSection = document.getElementById('responsavelSection');
    
    if (dataNascInput && responsavelSection) {
        dataNascInput.addEventListener('change', async function() {
            // Usa a função calculateAge do utils.js
            const idade = calculateAge(this.value);
            
            if (idade < 18) {
                responsavelSection.classList.remove('hidden');
                
                const responsavelSelect = document.getElementById('responsavelSelect');
                if (responsavelSelect) {
                    responsavelSelect.setAttribute('required', 'required');
                }
                
                // Busca da coleção pública (sempre dados atualizados)
                await carregarResponsaveisDoFirebase();
                
            } else {
                responsavelSection.classList.add('hidden');
                
                const responsavelSelect = document.getElementById('responsavelSelect');
                if (responsavelSelect) {
                    responsavelSelect.removeAttribute('required');
                    responsavelSelect.value = '';
                }
            }
        });
    }
});
