// js/selecao_assento.js
// Módulo de seleção de assentos com layout vertical (ônibus double decker)

let assentoSelecionado = null;
let callbackConfirmacao = null;
let assentosOcupados = [];

// Inicializa o módulo
function initSelecaoAssento(callback) {
    callbackConfirmacao = callback;
}

// Atualiza lista de assentos ocupados
function atualizarAssentosOcupados(voluntarios) {
    assentosOcupados = voluntarios.map(v => parseInt(v.seatNumber));
    if (document.getElementById('seatModal').classList.contains('active')) {
        renderizarAssentos();
    }
}

// Abre o modal
function abrirModalAssentos() {
    assentoSelecionado = null;
    document.getElementById('confirmSeatBtn').disabled = true;
    document.getElementById('selectedSeatDisplay').textContent = '';
    document.getElementById('seatModal').classList.add('active');
    renderizarAssentos();
}

// Fecha o modal
function fecharModalAssentos() {
    document.getElementById('seatModal').classList.remove('active');
    assentoSelecionado = null;
}

// Confirma a seleção
function confirmarSelecaoAssento() {
    if (assentoSelecionado && callbackConfirmacao) {
        callbackConfirmacao(assentoSelecionado);
    }
}

// Renderiza os dois decks
function renderizarAssentos() {
    const container = document.querySelector('.bus-container');
    container.innerHTML = '';

    // Renderiza Deck Superior
    container.appendChild(criarDeckSuperior());

    // Renderiza Deck Inferior
    container.appendChild(criarDeckInferior());
}

// ==========================================
// DECK SUPERIOR (48 assentos) - CORRIGIDO
// ==========================================
function criarDeckSuperior() {
    const deck = document.createElement('div');
    deck.className = 'deck-section upper';

    // Header
    const header = document.createElement('div');
    header.className = 'deck-header';
    header.innerHTML = '<div class="deck-title">🟦 PISO SUPERIOR (48 assentos)</div>';
    deck.appendChild(header);

    // Área da frente
    const frente = document.createElement('div');
    frente.className = 'area-frente';
    frente.innerHTML = '<span class="volante">🚌</span> FRENTE';
    deck.appendChild(frente);

    // Container do grid
    const gridContainer = document.createElement('div');
    gridContainer.className = 'bus-grid-vertical';

    // Fileiras 1-2: Assentos 1-8 (completo)
    gridContainer.appendChild(criarFileiraCompleta(1));
    gridContainer.appendChild(criarFileiraCompleta(5));

    // Fileira 3: Assentos 9-10 (esq) + Escada (dir)
    gridContainer.appendChild(criarFileiraEscada(9));

    // Fileira 4: Assentos 11-12 (esq) + Cafeteria/Frigobar (dir)
    gridContainer.appendChild(criarFileiraCafeteria(11));

    // CORREÇÃO: Fileira 5 - Assentos 13-16 (completo)
    gridContainer.appendChild(criarFileiraCompleta(13));

    // Fileiras 6-12: Assentos 17-44 (completo)
    for (let i = 4; i < 11; i++) {
        gridContainer.appendChild(criarFileiraCompleta(1 + (i * 4)));
    }

    // Última fileira especial: 45, 46, Frigobar, 48, 47
    gridContainer.appendChild(criarFileiraFinalFrigobar());

    deck.appendChild(gridContainer);
    return deck;
}

// ==========================================
// DECK INFERIOR (12 assentos) - 4 FILEIRAS DE 3 ASSENTOS
// ==========================================
function criarDeckInferior() {
    const deck = document.createElement('div');
    deck.className = 'deck-section lower';

    // Header
    const header = document.createElement('div');
    header.className = 'deck-header';
    header.innerHTML = '<div class="deck-title">🟨 PISO INFERIOR (12 assentos)</div>';
    deck.appendChild(header);

    // Container do grid
    const gridContainer = document.createElement('div');
    gridContainer.className = 'bus-grid-vertical';

    // 1. Frente: Motorista (esq) + 2º Motorista (dir)
    const frente = document.createElement('div');
    frente.className = 'area-frente inferior';
    frente.style.display = 'grid';
    frente.style.gridTemplateColumns = '1fr 1fr';
    frente.style.gap = '8px';
    frente.style.padding = '10px';
    frente.innerHTML = `
        <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 6px; font-size: 0.7rem; text-align: center;">
            <div style="font-size: 1rem; margin-bottom: 2px;">👨‍✈️</div>
            MOTORISTA
        </div>
        <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 6px; font-size: 0.7rem; text-align: center;">
            <div style="font-size: 1rem; margin-bottom: 2px;">👨‍✈️</div>
            2º MOTORISTA
        </div>
    `;
    gridContainer.appendChild(frente);

    // 2. Sala VIP (esq) + Cama Motorista (dir)
    const area1 = document.createElement('div');
    area1.style.display = 'grid';
    area1.style.gridTemplateColumns = '1fr 1fr';
    area1.style.gap = '8px';
    area1.style.marginBottom = '8px';
    area1.innerHTML = `
        <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 15px 8px; border-radius: 8px; text-align: center; font-size: 0.7rem; font-weight: bold;">
            <div style="font-size: 1.1rem; margin-bottom: 4px;">🛋️</div>
            SALA VIP
        </div>
        <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 15px 8px; border-radius: 8px; text-align: center; font-size: 0.7rem; font-weight: bold;">
            <div style="font-size: 1.1rem; margin-bottom: 4px;">🛏️</div>
            CAMA MOTORISTA
        </div>
    `;
    gridContainer.appendChild(area1);

    // 3. Banheiro (esq) + Porta com Escada (dir)
    const area2 = document.createElement('div');
    area2.style.display = 'grid';
    area2.style.gridTemplateColumns = '1fr 1fr';
    area2.style.gap = '8px';
    area2.style.marginBottom = '8px';
    area2.innerHTML = `
        <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 15px 8px; border-radius: 8px; text-align: center; font-size: 0.7rem; font-weight: bold;">
            <div style="font-size: 1.1rem; margin-bottom: 4px;">🚻</div>
            BANHEIRO
        </div>
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 8px; border-radius: 8px; text-align: center; font-size: 0.6rem; font-weight: bold; display: flex; flex-direction: column; justify-content: center; gap: 4px;">
            <div style="font-size: 0.9rem;">🚪</div>
            <div>PORTA</div>
            <div style="font-size: 0.9rem;">🚶</div>
            <div>ESCADA</div>
        </div>
    `;
    gridContainer.appendChild(area2);

    // 4. QUATRO fileiras de 3 assentos: 2 na esquerda + 1 na direita
    // Fileira 1: 49, 50 (esq) | corredor | 51 (dir)
    gridContainer.appendChild(criarFileiraInferior3Assentos(49));
    
    // Fileira 2: 52, 53 (esq) | corredor | 54 (dir)
    gridContainer.appendChild(criarFileiraInferior3Assentos(52));
    
    // Fileira 3: 55, 56 (esq) | corredor | 57 (dir)
    gridContainer.appendChild(criarFileiraInferior3Assentos(55));
    
    // Fileira 4: 58, 59 (esq) | corredor | 60 (dir)
    gridContainer.appendChild(criarFileiraInferior3Assentos(58));

    // 5. Bagageiro (espaço vazio)
    const bagageiro = document.createElement('div');
    bagageiro.style.background = 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)';
    bagageiro.style.color = 'white';
    bagageiro.style.padding = '25px';
    bagageiro.style.borderRadius = '8px';
    bagageiro.style.textAlign = 'center';
    bagageiro.style.fontSize = '1rem';
    bagageiro.style.fontWeight = 'bold';
    bagageiro.style.marginTop = '8px';
    bagageiro.style.minHeight = '80px';
    bagageiro.style.display = 'flex';
    bagageiro.style.alignItems = 'center';
    bagageiro.style.justifyContent = 'center';
    bagageiro.innerHTML = '🧳 BAGAGEIRO';
    gridContainer.appendChild(bagageiro);

    deck.appendChild(gridContainer);
    return deck;
}

// Cria uma fileira completa (4 assentos: 2 + corredor + 2)
// CORREÇÃO: Lado direito invertido para ímpares ficarem na janela
function criarFileiraCompleta(numInicial) {
    const fileira = document.createElement('div');
    fileira.className = 'fileira-simples';

    // Lado esquerdo (2 assentos): numInicial (janela), numInicial+1 (corredor)
    // Ex: 1, 2
    const esquerdo = document.createElement('div');
    esquerdo.className = 'lado-esquerdo';
    esquerdo.appendChild(criarPoltrona(numInicial));      // 1 (janela)
    esquerdo.appendChild(criarPoltrona(numInicial + 1));  // 2 (corredor)
    fileira.appendChild(esquerdo);

    // Corredor
    const corredor = document.createElement('div');
    corredor.className = 'espaco-meio';
    corredor.innerHTML = '│││';
    fileira.appendChild(corredor);

    // Lado direito (2 assentos) - ORDEM INVERTIDA: numInicial+3 (corredor), numInicial+2 (janela)
    // Ex: 4, 3 (antes era 3, 4)
    const direito = document.createElement('div');
    direito.className = 'lado-direito';
    direito.appendChild(criarPoltrona(numInicial + 3));    // 4 (corredor) ← INVERTIDO
    direito.appendChild(criarPoltrona(numInicial + 2));   // 3 (janela)  ← INVERTIDO
    fileira.appendChild(direito);

    return fileira;
}

// NOVA FUNÇÃO: Cria fileira do deck inferior com 3 assentos (2 esq + 1 dir)
// Disposição: numInicial, numInicial+1 (esq) | corredor | numInicial+2 (dir)
function criarFileiraInferior3Assentos(numInicial) {
    const fileira = document.createElement('div');
    fileira.className = 'fileira-simples';

    // Lado esquerdo (2 assentos): numInicial (janela), numInicial+1 (corredor)
    // Ex: 49, 50 ou 52, 53 ou 55, 56 ou 58, 59
    const esquerdo = document.createElement('div');
    esquerdo.className = 'lado-esquerdo';
    esquerdo.appendChild(criarPoltrona(numInicial));      // 49, 52, 55, 58 (janela)
    esquerdo.appendChild(criarPoltrona(numInicial + 1));  // 50, 53, 56, 59 (corredor)
    fileira.appendChild(esquerdo);

    // Corredor
    const corredor = document.createElement('div');
    corredor.className = 'espaco-meio';
    corredor.innerHTML = '│││';
    fileira.appendChild(corredor);

    // Lado direito (1 assento): numInicial+2 (janela - único assento do lado)
    // Ex: 51, 54, 57, 60
    // Como é ímpar (51, 57) ou par (54, 60), fica na posição externa (janela)
    const direito = document.createElement('div');
    direito.className = 'lado-direito';
    direito.style.gridTemplateColumns = '1fr'; // Apenas 1 coluna
    
    // Cria espaço vazio no corredor e o assento na janela
    const espacoVazio = document.createElement('div');
    espacoVazio.style.visibility = 'hidden'; // Espaço invisível para alinhar
    
    const assento = criarPoltrona(numInicial + 2); // 51, 54, 57, 60
    
    // Decide posição: se ímpar (51, 57) fica na "janela" (posição 2), se par (54, 60) também
    // Como só tem 1 assento, ele ocupa a posição da janela (segunda posição)
    direito.appendChild(espacoVazio);  // Espaço do corredor (invisível)
    direito.appendChild(assento);      // Assento na janela
    
    fileira.appendChild(direito);

    return fileira;
}

// Cria fileira com escada (fileira 3: 9-10 + escada)
function criarFileiraEscada(numInicial) {
    const fileira = document.createElement('div');
    fileira.className = 'fileira-simples';

    // Lado esquerdo (2 assentos: 9-10)
    // 9 (janela), 10 (corredor)
    const esquerdo = document.createElement('div');
    esquerdo.className = 'lado-esquerdo';
    esquerdo.appendChild(criarPoltrona(numInicial));      // 9 (janela)
    esquerdo.appendChild(criarPoltrona(numInicial + 1));  // 10 (corredor)
    fileira.appendChild(esquerdo);

    // Corredor
    const corredor = document.createElement('div');
    corredor.className = 'espaco-meio';
    corredor.innerHTML = '│││';
    fileira.appendChild(corredor);

    // Lado direito: ESCADA (ocupa espaço de 2 assentos)
    const escada = document.createElement('div');
    escada.className = 'escada-meio';
    escada.style.gridColumn = 'span 2';
    escada.innerHTML = `
        <div style="font-size: 1rem;">🚶</div>
        <div>ESCADA</div>
    `;
    fileira.appendChild(escada);

    return fileira;
}

// Cria fileira com cafeteria (fileira 4: 11-12 + cafeteria)
function criarFileiraCafeteria(numInicial) {
    const fileira = document.createElement('div');
    fileira.className = 'fileira-simples';

    // Lado esquerdo (2 assentos: 11-12)
    // 11 (janela), 12 (corredor)
    const esquerdo = document.createElement('div');
    esquerdo.className = 'lado-esquerdo';
    esquerdo.appendChild(criarPoltrona(numInicial));      // 11 (janela)
    esquerdo.appendChild(criarPoltrona(numInicial + 1));  // 12 (corredor)
    fileira.appendChild(esquerdo);

    // Corredor
    const corredor = document.createElement('div');
    corredor.className = 'espaco-meio';
    corredor.innerHTML = '│││';
    fileira.appendChild(corredor);

    // Lado direito: CAFETERIA/FRIGOBAR
    const cafeteria = document.createElement('div');
    cafeteria.style.background = 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)';
    cafeteria.style.color = 'white';
    cafeteria.style.borderRadius = '8px';
    cafeteria.style.padding = '8px';
    cafeteria.style.textAlign = 'center';
    cafeteria.style.fontSize = '0.6rem';
    cafeteria.style.fontWeight = 'bold';
    cafeteria.style.gridColumn = 'span 2';
    cafeteria.style.display = 'flex';
    cafeteria.style.flexDirection = 'column';
    cafeteria.style.alignItems = 'center';
    cafeteria.style.justifyContent = 'center';
    cafeteria.style.minHeight = '50px';
    cafeteria.innerHTML = `
        <div style="font-size: 0.9rem; margin-bottom: 2px;">☕ 🧊</div>
        <div>CAFETERIA</div>
        <div style="font-size: 0.5rem; margin-top: 2px;">E FRIGOBAR</div>
    `;
    fileira.appendChild(cafeteria);

    return fileira;
}

// Cria última fileira do deck superior: 45, 46, Frigobar, 48, 47
// CORREÇÃO: Lado direito invertido: 48 (corredor), 47 (janela)
function criarFileiraFinalFrigobar() {
    const fileira = document.createElement('div');
    fileira.className = 'fileira-simples';

    // Lado esquerdo: 45 (janela), 46 (corredor)
    const esquerdo = document.createElement('div');
    esquerdo.className = 'lado-esquerdo';
    esquerdo.appendChild(criarPoltrona(45));  // 45 (janela)
    esquerdo.appendChild(criarPoltrona(46));  // 46 (corredor)
    fileira.appendChild(esquerdo);

    // Meio: FRIGOBAR (no lugar do corredor)
    const frigobar = document.createElement('div');
    frigobar.style.background = '#facc15';
    frigobar.style.color = '#854d0e';
    frigobar.style.borderRadius = '6px';
    frigobar.style.padding = '4px';
    frigobar.style.textAlign = 'center';
    frigobar.style.fontSize = '0.55rem';
    frigobar.style.fontWeight = 'bold';
    frigobar.style.writingMode = 'vertical-rl';
    frigobar.style.textOrientation = 'mixed';
    frigobar.style.display = 'flex';
    frigobar.style.alignItems = 'center';
    frigobar.style.justifyContent = 'center';
    frigobar.textContent = '🧊 FRIGOBAR';
    fileira.appendChild(frigobar);

    // Lado direito: 48 (corredor), 47 (janela) - ORDEM INVERTIDA
    const direito = document.createElement('div');
    direito.className = 'lado-direito';
    direito.appendChild(criarPoltrona(48));   // 48 (corredor) ← INVERTIDO
    direito.appendChild(criarPoltrona(47));   // 47 (janela)  ← INVERTIDO
    fileira.appendChild(direito);

    return fileira;
}

// Cria uma poltrona individual
function criarPoltrona(numero) {
    const poltrona = document.createElement('div');
    poltrona.className = 'poltrona';
    poltrona.dataset.numero = numero;

    const numeroEl = document.createElement('span');
    numeroEl.className = 'numero-poltrona';
    numeroEl.textContent = numero.toString().padStart(2, '0');
    poltrona.appendChild(numeroEl);

    // Verifica se está ocupada
    if (assentosOcupados.includes(numero)) {
        poltrona.classList.add('ocupada');
        poltrona.title = `Assento ${numero} - Ocupado`;
    } else {
        poltrona.addEventListener('click', () => selecionarPoltrona(numero));
    }

    return poltrona;
}

// Seleciona uma poltrona
function selecionarPoltrona(numero) {
    // Remove seleção anterior
    document.querySelectorAll('.poltrona.selected').forEach(p => {
        p.classList.remove('selected');
    });

    // Seleciona nova
    const poltrona = document.querySelector(`[data-numero="${numero}"]`);
    if (poltrona) {
        poltrona.classList.add('selected');
        assentoSelecionado = numero;
        document.getElementById('confirmSeatBtn').disabled = false;
        document.getElementById('selectedSeatDisplay').textContent = numero.toString().padStart(2, '0');
    }
}
