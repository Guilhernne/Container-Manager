const inputContainer = document.getElementById('containerNumero');
const modal = document.getElementById('modalFicha');
const botoes = document.querySelectorAll('.btn-container');
const statusBotoes = document.querySelectorAll('.status-btn');
const containerVisual = document.getElementById('containerVisual');
const btnSalvar = document.getElementById('btnSalvar');
const inputBusca = document.getElementById("buscarContainer");

let statusAtual = null;

/* ======================
        BUSCAR
========================*/
// escuta o ENTER no campo de busca
inputBusca.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const numero = inputBusca.value.trim();

    if (!numero) return;

    abrirFicha(numero);
    inputBusca.value = ""; // limpa o campo
  }
});

function abrirFicha(numero) {
  const botaoExiste = document.querySelector(
    `.btn-container[data-numero="${numero}"]`
  );

  if (!botaoExiste) {
    alert("Container não encontrado");
    return;
  }

  inputContainer.value = numero;
  carregarContainer(numero);
  modal.style.display = "flex";
}

/* =========================
   ABRIR MODAL + CARREGAR
========================= */
botoes.forEach(botao => {
  botao.addEventListener('click', () => {
    const numero = botao.dataset.numero;
    
    inputContainer.value = numero;
    carregarContainer(numero);
    modal.style.display = 'flex';
  });
});

/* =========================
        STATUS
========================= */
statusBotoes.forEach(botao => {
  botao.addEventListener('click', () => {
    containerVisual.classList.remove('obra', 'reforma', 'patio');

    statusAtual = botao.dataset.status;
    containerVisual.classList.add(statusAtual);
  });
});

/* =========================
        SALVAR
========================= */
  btnSalvar.addEventListener('click', () => {
  const numero = inputContainer.value;

  if (!numero) {
    alert('Número do container inválido');
    return;
  }

  const tamanho =
    document.querySelector('input[name="tam"]:checked')?.value || '';

  const dados = {
    status: statusAtual, // pode ser null
    cliente: document.getElementById('cliente').value.trim(),
    endereco: document.getElementById('endereco').value.trim(),
    bairro: document.getElementById('bairro').value.trim(),
    cidade: document.getElementById('cidade').value.trim(),
    pedreiro: document.getElementById('pedreiro').value.trim(),
    observacao: document.getElementById('observacao').value.trim(),
    tamanho
  };

  const containers = JSON.parse(localStorage.getItem('containers')) || {};

  // 🔥 sobrescreve totalmente os dados antigos
  containers[numero] = {
    ...dados,
    status: statusAtual
  };
  localStorage.setItem('containers', JSON.stringify(containers));

  atualizarGrid();
  fecharModal();
});


/* =========================
     CARREGAR CONTAINER
========================= */
function carregarContainer(numero) {
  const containers = JSON.parse(localStorage.getItem('containers')) || {};
  const dados = containers[numero];
  
  limparCampos();
  
  if (!dados)  return ;

  containerVisual.classList.remove('obra', 'reforma', 'patio');

  if (dados.status) {
    statusAtual = dados.status;
    containerVisual.classList.add(statusAtual);
  }

  document.getElementById('cliente').value = dados.cliente || '';
  document.getElementById('endereco').value = dados.endereco || '';
  document.getElementById('bairro').value = dados.bairro || '';
  document.getElementById('cidade').value = dados.cidade || '';
  document.getElementById('pedreiro').value = dados.pedreiro || '';
  document.getElementById('observacao').value = dados.observacao || '';

  if (dados.tamanho) {
    document.querySelector(`input[name="tam"][value="${dados.tamanho}"]`).checked = true;
  }
  
}

/* =========================
         LIMPAR
========================= */
function limparCampos() {
  /*inputContainer.value = '';*/
 const numeroAtual = inputContainer.value;

  // reseta status
  statusAtual = null;
  containerVisual.className = 'container-visual';

  // limpa todos os inputs e textarea, exceto o número
  document.querySelectorAll('.ficha input, .ficha textarea').forEach(campo => {
    if (campo.id !== 'containerNumero') {
      campo.value = '';
    }
  });

  // desmarca os radios de tamanho
  document.querySelectorAll('input[name="tam"]').forEach(radio => {
    radio.checked = false;
  });

  // garante que o número continue no campo
  inputContainer.value = numeroAtual;
}

/*========================
      GRID
========================*/
function atualizarGrid() {
  const containers = JSON.parse(localStorage.getItem('containers')) || {};

  botoes.forEach(botao => {
    const numero = botao.dataset.numero;
    botao.classList.remove('obra', 'reforma', 'patio');

    if (containers[numero]?.status) {
      botao.classList.add(containers[numero].status);
    }
  });
}

/*========================
        FECHAR
========================*/
function fecharModal() {
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', atualizarGrid);

/*========================
    ABRIR/FECHAR MENU
======================= */
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function abrirMenu() {
  sidebar.classList.add('ativo');
  overlay.classList.add('ativo');
}

function fecharMenu() {
  sidebar.classList.remove('ativo');
  overlay.classList.remove('ativo');
}

function abrirAdicionar() {
  fecharMenu();
  alert('Adicionar container (em breve)');
}

function abrirExcluir() {
  fecharMenu();
  alert('Excluir container (em breve)');
}

function abrirGaleria() {
  fecharMenu();
  alert('Galeria de fotos (em breve)');
}

function abrirRelatorio() {
  fecharMenu();
  alert('Relatório (em breve)');
}

const modalGerenciar = document.getElementById('modalGerenciar');

function verificarContainer() {
  const numero = document.getElementById('gerenciarNumero').value.trim();
  const info = document.getElementById('infoGerenciar');
  const btnAdicionar = document.getElementById('btnAdicionar');
  const btnExcluir = document.getElementById('btnExcluir');

  const containers = JSON.parse(localStorage.getItem('containers')) || {};

  
  info.textContent = '';
  btnAdicionar.disabled = true;
  btnExcluir.disabled = true;
  
  if (!numero) return;
  

  if (containers[numero]) {
    info.textContent = '⚠ Container já existe.';
    info.style.color = 'red';
    
    btnExcluir.disabled = false;
  } else {
    info.textContent = '✔ Container não existe.';
    info.style.color = 'green';
    
    btnAdicionar.disabled = false;
  }
}

function confirmarGerenciamento() {
  const numero = document.getElementById('gerenciarNumero').value.trim();
  const acao = document.getElementById('btnGerenciar').dataset.acao;

  if (!numero) {
    alert('Informe o número do container');
    return;
  }

  if (acao === 'excluir') {
    excluirContainer(numero);
  } else {
    adicionarContainer(numero);
  }
}

function adicionarDoGerenciar() {
  const numero = document.getElementById('gerenciarNumero').value.trim();
  if (!numero) return;

  adicionarContainer(numero);
}

function excluirDoGerenciar() {
  const numero = document.getElementById('gerenciarNumero').value.trim();
  if (!numero) return;

  excluirContainer(numero);
}

function abrirGerenciar() {
  fecharMenu();
  modalGerenciar.style.display = 'flex';
}

function fecharGerenciar() {
  modalGerenciar.style.display = 'none';
  document.getElementById('gerenciarNumero').value = '';
}

function adicionarContainer(numero) {
  const containers = JSON.parse(localStorage.getItem('containers')) || {};

  containers[numero] = { status: null };

  localStorage.setItem('containers', JSON.stringify(containers));
  criarBotaoContainer(numero);
  fecharGerenciar();
}

function excluirContainer(numero) {
  const containers = JSON.parse(localStorage.getItem('containers')) || {};

  if (!confirm(`Excluir container ${numero}?`)) return;

  delete containers[numero];
  localStorage.setItem('containers', JSON.stringify(containers));

  document
    .querySelector(`.btn-container[data-numero="${numero}"]`)
    ?.remove();

  fecharGerenciar();
}

function criarBotaoContainer(numero) {
  const grid = document.querySelector('.container-grid');

  const botao = document.createElement('button');
  botao.className = 'btn-container';
  botao.dataset.numero = numero;
  botao.textContent = numero;

  botao.addEventListener('click', () => {
    inputContainer.value = numero;
    carregarContainer(numero);
    modal.style.display = 'flex';
  });

  grid.appendChild(botao);
}

function fecharGerenciar() {
  document.getElementById('modalGerenciar').style.display = 'none';
  document.getElementById('gerenciarNumero').value = '';
  document.getElementById('infoGerenciar').textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const containers = JSON.parse(localStorage.getItem('containers')) || {};

  Object.keys(containers).forEach(numero => {
    if (!document.querySelector(`.btn-container[data-numero="${numero}"]`)) {
      criarBotaoContainer(numero);
    }
  });

  atualizarGrid();
});