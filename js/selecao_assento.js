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

// Cria o Deck Superior (48 assentos) - Layout exato conforme imagem
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

    // Fileiras 5-12: Assentos 13-48 (completo)
    for (let i = 4; i < 12; i++) {
        gridContainer.appendChild(criarFileiraCompleta(1 + (i * 4)));
    }

    // Última fileira especial: 45, 46, Frigobar, 48, 47
    gridContainer.appendChild(criarFileiraFinalFrigobar());

    deck.appendChild(gridContainer);
    return deck;
}

// Cria o Deck Inferior (12 assentos) - Layout exato conforme imagem
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

    // Área da frente: Cama motorista (esq) + Entrada (dir)
    const frente = document.createElement('div');
    frente.className = 'area-frente inferior';
    frente.style.display = 'grid';
    frente.style.gridTemplateColumns = '1fr 1fr';
    frente.style.gap = '8px';
    frente.style.padding = '10px';
    frente.innerHTML = `
        <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 6px; font-size: 0.7rem; text-align: center;">
            <div style="font-size: 1rem; margin-bottom: 2px;">🛏️</div>
            CAMA MOTORISTA
        </div>
        <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 6px; font-size: 0.7rem; text-align: center;">
            <div style="font-size: 1rem; margin-bottom: 2px;">🚪</div>
            ENTRADA
        </div>
    `;
    gridContainer.appendChild(frente);

    // Sala VIP (esq) + Banheiro (dir)
    const areaServicos = document.createElement('div');
    areaServicos.style.display = 'grid';
    areaServicos.style.gridTemplateColumns = '1fr 1fr';
    areaServicos.style.gap = '8px';
    areaServicos.style.marginBottom = '8px';
    areaServicos.innerHTML = `
        <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 15px 8px; border-radius: 8px; text-align: center; font-size: 0.7rem; font-weight: bold;">
            <div style="font-size: 1.1rem; margin-bottom: 4px;">🛋️</div>
            SALA VIP
        </div>
        <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 15px 8px; border-radius: 8px; text-align: center; font-size: 0.7rem; font-weight: bold;">
            <div style="font-size: 1.1rem; margin-bottom: 4px;">🚻</div>
            BANHEIRO
        </div>
    `;
    gridContainer.appendChild(areaServicos);

    // Porta lateral
    const porta = document.createElement('div');
    porta.style.background = 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)';
    porta.style.color = 'white';
    porta.style.padding = '6px';
    porta.style.borderRadius = '4px';
    porta.style.textAlign = 'center';
    porta.style.fontSize = '0.6rem';
    porta.style.fontWeight = 'bold';
    porta.style.marginBottom = '10px';
    porta.style.letterSpacing = '3px';
    porta.textContent = '════ PORTA ════';
    gridContainer.appendChild(porta);

    // 3 fileiras de assentos: 49-52, 53-56, 57-60
    gridContainer.appendChild(criarFileiraCompleta(49));
    gridContainer.appendChild(criarFileiraCompleta(53));
    gridContainer.appendChild(criarFileiraCompleta(57));

    // Bagageiro com Frigobar acima
    const bagageiroArea = document.createElement('div');
    bagageiroArea.style.position = 'relative';
    bagageiroArea.style.marginTop = '8px';
    
    // Frigobar acima
    const frigobar = document.createElement('div');
    frigobar.style.background = '#facc15';
    frigobar.style.color = '#854d0e';
    frigobar.style.padding = '4px 8px';
    frigobar.style.borderRadius = '4px 4px 0 0';
    frigobar.style.textAlign = 'center';
    frigobar.style.fontSize = '0.6rem';
    frigobar.style.fontWeight = 'bold';
    frigobar.textContent = '🧊 FRIGOBAR';
    bagageiroArea.appendChild(frigobar);
    
    // Bagageiro
    const bagageiro = document.createElement('div');
    bagageiro.className = 'escada-final';
    bagageiro.style.background = 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)';
    bagageiro.style.borderRadius = '0 0 8px 8px';
    bagageiro.style.marginTop = '0';
    bagageiro.innerHTML = '🧳 BAGAGEIRO';
    bagageiroArea.appendChild(bagageiro);
    
    gridContainer.appendChild(bagageiroArea);

    deck.appendChild(gridContainer);
    return deck;
}

// Cria uma fileira completa (4 assentos: 2 + corredor + 2)
function criarFileiraCompleta(numInicial) {
    const fileira = document.createElement('div');
    fileira.className = 'fileira-simples';

    // Lado esquerdo (2 assentos)
    const esquerdo = document.createElement('div');
    esquerdo.className = 'lado-esquerdo';
    esquerdo.appendChild(criarPoltrona(numInicial));
    esquerdo.appendChild(criarPoltrona(numInicial + 1));
    fileira.appendChild(esquerdo);

    // Corredor
    const corredor = document.createElement('div');
    corredor.className = 'espaco-meio';
    corredor.innerHTML = '│││';
    fileira.appendChild(corredor);

    // Lado direito (2 assentos)
    const direito = document.createElement('div');
    direito.className = 'lado-direito';
    direito.appendChild(criarPoltrona(numInicial + 2));
    direito.appendChild(criarPoltrona(numInicial + 3));
    fileira.appendChild(direito);

    return fileira;
}

// Cria fileira com escada (fileira 3: 9-10 + escada)
function criarFileiraEscada(numInicial) {
    const fileira = document.createElement('div');
    fileira.className = 'fileira-simples';

    // Lado esquerdo (2 assentos: 9-10)
    const esquerdo = document.createElement('div');
    esquerdo.className = 'lado-esquerdo';
    esquerdo.appendChild(criarPoltrona(numInicial));
    esquerdo.appendChild(criarPoltrona(numInicial + 1));
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
    const esquerdo = document.createElement('div');
    esquerdo.className = 'lado-esquerdo';
    esquerdo.appendChild(criarPoltrona(numInicial));
    esquerdo.appendChild(criarPoltrona(numInicial + 1));
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

// Cria última fileira com frigobar no meio: 45, 46, FRIGOBAR, 48, 47
function criarFileiraFinalFrigobar() {
    const fileira = document.createElement('div');
    fileira.className = 'fileira-simples';

    // Lado esquerdo: 45, 46
    const esquerdo = document.createElement('div');
    esquerdo.className = 'lado-esquerdo';
    esquerdo.appendChild(criarPoltrona(45));
    esquerdo.appendChild(criarPoltrona(46));
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

    // Lado direito: 48, 47 (ordem invertida: 48 na frente, 47 atrás)
    const direito = document.createElement('div');
    direito.className = 'lado-direito';
    direito.appendChild(criarPoltrona(48));
    direito.appendChild(criarPoltrona(47));
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
