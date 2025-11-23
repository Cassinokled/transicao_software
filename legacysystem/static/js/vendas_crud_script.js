document.addEventListener('DOMContentLoaded', () => {

    const campos = {
        cliente: document.querySelector('#vendaClienteSearch'),
        data: document.querySelector('#vendaData'),
        valorTotal: document.querySelector('#vendaValorTotal'),
        status: document.querySelector('#vendaStatus')
    };

    const addButton = document.querySelector('.addbotaovenda');
    const modalOverlay = document.querySelector('#modalOverlayVenda');
    const fecharModalCancelar = document.querySelector('#fecharModalVendaCancelar');

    const salvarButton = document.querySelector('#salvarVenda');
    const excluirButton = document.querySelector('#excluirVenda');
    const listaVendas = document.querySelector('#vendasTbody');

    const vendaError = document.querySelector('#vendaError');
    const vendaErrorMessage = document.querySelector('#vendaErrorMessage');

    let modoEdicao = false;
    let vendaEditandoID = null;
    let ultimoId = Date.now();

    const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    function safeNumber(value) {
        const n = parseFloat(String(value).replace(/,/g, '.'));
        return isNaN(n) ? 0 : n;
    }

    if (addButton) {
        addButton.addEventListener('click', () => {
            modoEdicao = false;
            vendaEditandoID = null;
            limparInputs();
            abrirModal();
        });
    }

    function abrirModal() {
        if (!modalOverlay) return;
        modalOverlay.style.display = 'flex';
        modalOverlay.setAttribute('aria-hidden','false');
        if (vendaError) { vendaError.style.display = 'none'; vendaError.setAttribute('aria-hidden','true'); }
        const first = document.querySelector('#vendaClienteSearch'); if (first) first.focus();
    }

    function fecharModal() {
        if (!modalOverlay) return;
        modalOverlay.style.display = 'none';
        modalOverlay.setAttribute('aria-hidden','true');
        modoEdicao = false; vendaEditandoID = null; limparInputs();
        if (vendaError) { vendaError.style.display = 'none'; vendaError.setAttribute('aria-hidden','true'); }
    }

    if (fecharModalCancelar) fecharModalCancelar.addEventListener('click', fecharModal);

    // date input reference (no calendar button)
    const vendaData = document.querySelector('#vendaData');

    if (salvarButton) salvarButton.addEventListener('click', () => {
        const cliente = campos.cliente?.value.trim() ?? '';
        const data = campos.data?.value ?? '';
        const valor = campos.valorTotal?.value.trim() ?? '';
        const status = campos.status?.value ?? '';

        if (!cliente || !data || !valor || !status) {
            if (vendaErrorMessage) vendaErrorMessage.textContent = 'Preenchimento de todos os campos é obrigatório.';
            if (vendaError) { vendaError.style.display = 'block'; vendaError.setAttribute('aria-hidden','false'); }
            return;
        }

        const dados = {
            id: ++ultimoId,
            numero: gerarNumeroVenda(),
            cliente: cliente,
            data: data,
            valorTotal: safeNumber(valor),
            status: status
        };

        if (modoEdicao) {
            atualizarVenda(vendaEditandoID, dados);
        } else {
            criarVenda(dados);
        }

        fecharModal();
    });

    function criarVenda(dados) {
        const tr = document.createElement('tr');
        tr.dataset.id = dados.id; tr.vendaData = dados;
        const tdNumero = document.createElement('td'); tdNumero.textContent = formatNumeroVenda(dados.numero);
        const tdCliente = document.createElement('td'); tdCliente.textContent = dados.cliente;
        const tdData = document.createElement('td'); tdData.textContent = formatDataDisplay(dados.data);
        const tdValor = document.createElement('td'); tdValor.textContent = currencyFormatter.format(Number(dados.valorTotal) || 0);
        const tdStatus = document.createElement('td');

        // construir status com dot colorido + label
        const statusWrapper = document.createElement('span');
        statusWrapper.className = 'status-wrapper';
        const statusDot = document.createElement('span');
        statusDot.className = 'status-dot ' + statusClassFor(dados.status);
        statusWrapper.appendChild(statusDot);
        const statusLabel = document.createElement('span'); statusLabel.textContent = ' ' + dados.status;
        statusWrapper.appendChild(statusLabel);
        tdStatus.appendChild(statusWrapper);

        const tdAcoes = document.createElement('td');
        const viewBtn = document.createElement('button'); viewBtn.type = 'button'; viewBtn.className = 'acoes-btn view-btn'; viewBtn.title = 'Visualizar'; viewBtn.textContent = '👁️';
        viewBtn.addEventListener('click', () => abrirEdicao(dados.id));
        const editBtn = document.createElement('button'); editBtn.type = 'button'; editBtn.className = 'acoes-btn edit-btn'; editBtn.title = 'Editar'; editBtn.textContent = '✏️';
        editBtn.addEventListener('click', () => abrirEdicao(dados.id));
        const delBtn = document.createElement('button'); delBtn.type = 'button'; delBtn.className = 'acoes-btn delete-btn'; delBtn.title = 'Excluir'; delBtn.textContent = '🗑️';
        delBtn.addEventListener('click', () => { const trt = document.querySelector(`tr[data-id="${dados.id}"]`); if (trt) trt.remove(); });

        tdAcoes.appendChild(viewBtn); tdAcoes.appendChild(editBtn); tdAcoes.appendChild(delBtn);

        tr.appendChild(tdNumero); tr.appendChild(tdCliente); tr.appendChild(tdData); tr.appendChild(tdValor); tr.appendChild(tdStatus); tr.appendChild(tdAcoes);
        if (listaVendas) listaVendas.appendChild(tr);
    }

    function abrirEdicao(id) {
        modoEdicao = true; vendaEditandoID = id;
        const tr = document.querySelector(`tr[data-id="${id}"]`);
        if (!tr || !tr.vendaData) return; const d = tr.vendaData;
        if (campos.cliente) campos.cliente.value = d.cliente ?? '';
        if (campos.data) campos.data.value = d.data ?? '';
        if (campos.valorTotal) campos.valorTotal.value = (typeof d.valorTotal === 'number') ? d.valorTotal.toFixed(2).replace('.',',') : (d.valorTotal ?? '');
        if (campos.status) campos.status.value = d.status ?? '';
        abrirModal();
    }

    function atualizarVenda(id, novosDados) {
        const tr = document.querySelector(`tr[data-id="${id}"]`);
        if (!tr || !tr.vendaData) return; const dados = tr.vendaData;
        dados.cliente = novosDados.cliente; dados.data = novosDados.data; dados.valorTotal = novosDados.valorTotal; dados.status = novosDados.status;
        const tds = tr.querySelectorAll('td');
        if (tds[1]) tds[1].textContent = dados.cliente;
        if (tds[2]) tds[2].textContent = formatDataDisplay(dados.data);
        if (tds[3]) tds[3].textContent = currencyFormatter.format(Number(dados.valorTotal) || 0);
        if (tds[4]) {
            tds[4].innerHTML = '';
            const statusWrapper = document.createElement('span'); statusWrapper.className = 'status-wrapper';
            const statusDot = document.createElement('span'); statusDot.className = 'status-dot ' + statusClassFor(dados.status);
            statusWrapper.appendChild(statusDot);
            const statusLabel = document.createElement('span'); statusLabel.textContent = ' ' + dados.status;
            statusWrapper.appendChild(statusLabel);
            tds[4].appendChild(statusWrapper);
        }
    }

    if (excluirButton) excluirButton.addEventListener('click', () => {
        if (!modoEdicao) return;
        const tr = document.querySelector(`tr[data-id="${vendaEditandoID}"]`);
        if (tr) tr.remove(); fecharModal();
    });

    function gerarNumeroVenda() {
        const itens = document.querySelectorAll('tr[data-id]');
        if (itens.length === 0) return '0001';
        let maior = 0;
        itens.forEach(item => { const n = parseInt(String(item.vendaData?.numero ?? '').replace(/\D/g,''),10); if (!isNaN(n) && n>maior) maior=n; });
        const next = maior + 1;
        return String(next).padStart(4,'0');
    }

    function limparInputs() { for (let k in campos) if (campos[k]) campos[k].value = ''; }

    function permitirSomenteNumeros(input) { if (!input) return; input.addEventListener('input', () => { input.value = input.value.replace(/[^0-9.,]/g,''); }); }
    permitirSomenteNumeros(document.querySelector('#vendaValorTotal'));

    // helpers
    function formatNumeroVenda(raw) {
        if (!raw) return '#0000';
        const s = String(raw).replace(/[^0-9]/g,'');
        return '#' + s.padStart(4,'0');
    }

    function formatDataDisplay(d) {
        if (!d) return '';
        if (d.indexOf('/') !== -1) return d;
        const parts = String(d).split('-');
        if (parts.length === 3) return parts[2] + '/' + parts[1] + '/' + parts[0];
        return d;
    }

    function statusClassFor(status) {
        const s = String(status).toLowerCase();
        if (s.includes('concl') || s.includes('pago')) return 'status-green';
        if (s.includes('pend')) return 'status-orange';
        if (s.includes('cancel') || s.includes('cancelad')) return 'status-red';
        return 'status-gray';
    }

    // busca somente ao clicar na lupa
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    function executarBusca() {
        const q = (searchInput?.value ?? '').trim().toLowerCase();
        const rows = document.querySelectorAll('#vendasTbody tr');
        rows.forEach(r => {
            const d = r.vendaData ?? {}; const cliente = String(d.cliente ?? '').toLowerCase(); const numero = String(d.numero ?? '').toLowerCase();
            const matches = q === '' ? true : (cliente.includes(q) || numero.includes(q));
            r.style.display = matches ? '' : 'none';
        });
    }
    if (searchIcon) searchIcon.addEventListener('click', executarBusca);

    // Enter avança campos
    function enableEnterAdvance(orderSelectors) {
        orderSelectors.forEach((sel, idx) => { const el = document.querySelector(sel); if (!el) return; el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); let nextEl=null; for (let j=idx+1;j<orderSelectors.length;j++){ const c=document.querySelector(orderSelectors[j]); if(c){ nextEl=c; break; } } if(nextEl){ nextEl.focus(); if(nextEl.select) try{ nextEl.select(); }catch(e){} } else { if(salvarButton) salvarButton.click(); } } }); });
    }
    enableEnterAdvance(['#vendaClienteSearch','#vendaData','#vendaValorTotal','#vendaStatus']);

});