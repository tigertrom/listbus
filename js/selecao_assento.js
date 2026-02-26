/**
 * selecao_assento.js
 * 
 * Módulo de seleção de assentos - Layout vertical tipo ônibus de viagem
 * 60 assentos: 1-48 (deck superior), 49-60 (deck inferior)
 * Com escada no meio do deck superior (entre assentos 14-15)
 */

let assentosOcupados = [];
let assentoSelecionado = null;
let callbackConfirmacao = null;

/**
 * Inicializa o módulo de assentos
 */
function initSelecaoAssento(onConfirmar) {
    callbackConfirmacao = onConfirmar;
    
    db.collection('volunteers_publico').onSnapshot((snapshot) => {
        assentosOcupados = [];
        snapshot.forEach((doc) => {
            const dados = doc.data();
            if (dados.seatNumber) {
                assentosOcupados.push({
                    numero: dados.seatNumber,
                    nome: `${dados.firstName} ${dados.lastName}`
                });
            }
        });
        console.log('Assentos ocupados:', assentosOcupados.length);
    });
}

/**
 * Abre o modal de seleção de assentos
 */
function abrirModalAssentos() {
    renderizarMapaAssentos();
    document.getElementById('seatModal').classList.add('active');
    assentoSelecionado = null;
    atualizarBotaoConfirmar();
}

/**
 * Fecha o modal
 */
function fecharModalAssentos() {
    document.getElementById('seatModal').classList.remove('active');
    assentoSelecionado = null;
}

/**
 * Renderiza o mapa de assentos - Layout vertical tipo ônibus
 */
function renderizarMapaAssentos() {
    const container = document.querySelector('.bus-container');
    container.innerHTML = '';
    
    const ocupados = assentosOcupados.map(a => a.numero);
    
    // ===== DECK SUPERIOR (48 assentos) =====
    const deckSuperior = document.createElement('div');
    deckSuperior.className = 'deck-section upper';
    
    // Cabeçalho
    const headerSup = document.createElement('div');
    headerSup.className = 'deck-header';
    headerSup.innerHTML = '<div class="deck-title">🟦 PISO SUPERIOR</div>';
    deckSuperior.appendChild(headerSup);
    
    // Área da frente do ônibus
    const areaFrente = document.createElement('div');
    areaFrente.className = 'area-frente';
    areaFrente.innerHTML = '<span class="volante">🚌</span><span>FRENTE</span>';
    deckSuperior.appendChild(areaFrente);
    
    // Container dos assentos superior
    const gridSup = document.createElement('div');
    gridSup.className = 'bus-grid-vertical';
    
    // Layout: 2 colunas laterais com escada no meio (entre fileiras 3-4)
    // Fileiras 1-3: sem escada (assentos 1-12)
    // Fileiras 4-12: com escada no meio (assentos 13-48)
    
    // FILEIRAS 1-3 (assentos 1-12) - sem escada
    for (let fileira = 0; fileira < 3; fileira++) {
        const divFileira = criarFileiraSimples(fileira, ocupados);
        gridSup.appendChild(divFileira);
    }
    
    // FILEIRA 4 (assentos 13-16) - com escada
    const fileiraEscada1 = criarFileiraComEscada(3, ocupados, false);
    gridSup.appendChild(fileiraEscada1);
    
    // FILEIRAS 5-11 (assentos 17-44) - com escada
    for (let fileira = 4; fileira < 11; fileira++) {
        const divFileira = criarFileiraComEscada(fileira, ocupados, false);
        gridSup.appendChild(divFileira);
    }
    
    // FILEIRA 12 (assentos 45-48) - com escada no final
    const fileiraFinal = criarFileiraComEscada(11, ocupados, true);
    gridSup.appendChild(fileiraFinal);
    
    deckSuperior.appendChild(gridSup);
    container.appendChild(deckSuperior);
    
    // ===== DECK INFERIOR (12 assentos) =====
    const deckInferior = document.createElement('div');
    deckInferior.className = 'deck-section lower';
    
    const headerInf = document.createElement('div');
    headerInf.className = 'deck-header';
    headerInf.innerHTML = '<div class="deck-title">🟨 PISO INFERIOR</div>';
    deckInferior.appendChild(headerInf);
    
    // Área da frente inferior
    const areaFrenteInf = document.createElement('div');
    areaFrenteInf.className = 'area-frente inferior';
    areaFrenteInf.innerHTML = '<span class="volante">🚌</span><span>FRENTE</span>';
    deckInferior.appendChild(areaFrenteInf);
    
    // Container dos assentos inferior
    const gridInf = document.createElement('div');
    gridInf.className = 'bus-grid-vertical';
    
    // 3 fileiras de 4 assentos (49-60) - sem escada
    for (let fileira = 0; fileira < 3; fileira++) {
        const base = 49 + (fileira * 4);
        const divFileira = document.createElement('div');
        divFileira.className = 'fileira-simples';
        
        // 2 esquerda + espaço + 2 direita
        const nums = [base, base + 1, null, base + 2, base + 3];
        
        nums.forEach(num => {
            if (num === null) {
                const espaco = document.createElement('div');
                espaco.className = 'espaco-meio';
                divFileira.appendChild(espaco);
            } else {
                divFileira.appendChild(criarAssento(num, ocupados.includes(num)));
            }
        });
        
        gridInf.appendChild(divFileira);
    }
    
    // Escada no final do deck inferior
    const escadaInf = document.createElement('div');
    escadaInf.className = 'escada-final';
    escadaInf.innerHTML = '🪜 ESCADA';
    gridInf.appendChild(escadaInf);
    
    deckInferior.appendChild(gridInf);
    container.appendChild(deckInferior);
}

/**
 * Cria fileira simples (sem escada) - fileiras 1-3
 */
function criarFileiraSimples(fileira, ocupados) {
    const div = document.createElement('div');
    div.className = 'fileira-simples';
    
    const base = (fileira * 4) + 1;
    const nums = [base, base + 1, null, base + 2, base + 3];
    
    nums.forEach(num => {
        if (num === null) {
            const espaco = document.createElement('div');
            espaco.className = 'espaco-meio';
            div.appendChild(espaco);
        } else {
            div.appendChild(criarAssento(num, ocupados.includes(num)));
        }
    });
    
    return div;
}

/**
 * Cria fileira com escada no meio
 */
function criarFileiraComEscada(fileira, ocupados, isUltima) {
    const div = document.createElement('div');
    div.className = 'fileira-com-escada';
    
    const base = (fileira * 4) + 1;
    
    // Lado esquerdo (2 assentos)
    const ladoEsq = document.createElement('div');
    ladoEsq.className = 'lado-esquerdo';
    ladoEsq.appendChild(criarAssento(base, ocupados.includes(base)));
    ladoEsq.appendChild(criarAssento(base + 1, ocupados.includes(base + 1)));
    div.appendChild(ladoEsq);
    
    // Escada no meio
    const escada = document.createElement('div');
    escada.className = 'escada-meio';
    if (fileira === 3) {
        escada.innerHTML = '🪜<br>ESC';
        escada.classList.add('inicio');
    } else if (isUltima) {
        escada.innerHTML = '🪜<br>FIM';
        escada.classList.add('fim');
    } else {
        escada.innerHTML = '⬇️';
        escada.classList.add('continua');
    }
    div.appendChild(escada);
    
    // Lado direito (2 assentos)
    const ladoDir = document.createElement('div');
    ladoDir.className = 'lado-direito';
    ladoDir.appendChild(criarAssento(base + 2, ocupados.includes(base + 2)));
    ladoDir.appendChild(criarAssento(base + 3, ocupados.includes(base + 3)));
    div.appendChild(ladoDir);
    
    return div;
}

/**
 * Cria um elemento de assento
 */
function criarAssento(numero, ocupado) {
    const div = document.createElement('div');
    div.className = 'poltrona';
    div.dataset.assento = numero;
    
    // Número do assento
    const numSpan = document.createElement('span');
    numSpan.className = 'numero-poltrona';
    numSpan.textContent = numero;
    div.appendChild(numSpan);
    
    if (ocupado) {
        div.classList.add('ocupada');
        const info = assentosOcupados.find(a => a.numero === numero);
        div.title = `Ocupado: ${info ? info.nome : ''}`;
    } else {
        div.addEventListener('click', () => selecionarAssento(numero));
    }
    
    return div;
}

/**
 * Seleciona um assento
 */
function selecionarAssento(numero) {
    document.querySelectorAll('.poltrona.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    const elemento = document.querySelector(`[data-assento="${numero}"]`);
    if (elemento) {
        elemento.classList.add('selected');
        assentoSelecionado = numero;
        atualizarBotaoConfirmar();
    }
}

/**
 * Atualiza o botão de confirmar
 */
function atualizarBotaoConfirmar() {
    const btn = document.getElementById('confirmSeatBtn');
    const display = document.getElementById('selectedSeatDisplay');
    
    if (assentoSelecionado) {
        btn.disabled = false;
        display.textContent = assentoSelecionado;
    } else {
        btn.disabled = true;
        display.textContent = '';
    }
}

/**
 * Confirma a seleção
 */
function confirmarSelecaoAssento() {
    if (!assentoSelecionado || !callbackConfirmacao) return;
    callbackConfirmacao(assentoSelecionado);
    fecharModalAssentos();
}

// Expõe funções globais
window.initSelecaoAssento = initSelecaoAssento;
window.abrirModalAssentos = abrirModalAssentos;
window.fecharModalAssentos = fecharModalAssentos;
window.confirmarSelecaoAssento = confirmarSelecaoAssento;
