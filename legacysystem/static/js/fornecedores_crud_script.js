document.addEventListener("DOMContentLoaded", () => {

    const campos = {
        nomeFornecedor: document.querySelector("#nomeFornecedor"),
        emailFornecedor: document.querySelector("#emailFornecedor"),
        celularFornecedor: document.querySelector("#celularFornecedor"),
        fixoFornecedor: document.querySelector("#fixoFornecedor"),
        codFornecedor: document.querySelector("#codFornecedor"),
        enderecoFornecedor: document.querySelector("#enderecoFornecedor"),
        cepFornecedor: document.querySelector("#cepFornecedor"),
        numeroFornecedor: document.querySelector("#numeroFornecedor"),
        ufFornecedor: document.querySelector("#ufFornecedor"),
        bairroFornecedor: document.querySelector("#bairroFornecedor"),
        cidadeFornecedor: document.querySelector("#cidadeFornecedor"),
        complementoFornecedor: document.querySelector("#complementoFornecedor"),
        cnpjFornecedor: document.querySelector("#cnpjFornecedor"),
    };

    const addButton = document.querySelector(".addFornecedorButton");
    const modalOverlay = document.querySelector("#modalOverlay");
    const fecharModalCancelar = document.querySelector("#fecharModalCancelar");

    const salvarButton = document.querySelector("#salvarFornecedor");
    const excluirButton = document.querySelector("#excluirFornecedor");
    const listaFornecedores = document.querySelector(".info-card");

    const inputNome = document.querySelector("#nomeFornecedor");
    const inputCod = document.querySelector("#codFornecedor");

    let modoEdicao = false;
    let fornecedorEditandoID = null;

    // abrir o modal
    addButton.addEventListener("click", () => {
        modoEdicao = false;
        fornecedorEditandoID = null;
        limparInputs();
        campos.codFornecedor.value = gerarCodAutomatico(); // gerar cod automático
        modalOverlay.style.display = "flex";
    });


    // fechar o modal
    function fecharModal() {
        modalOverlay.style.display = "none";
        modoEdicao = false;
        fornecedorEditandoID = null;

        document.querySelectorAll("#modalOverlay input").forEach(input => {
            input.value = "";
        });
    }

    // Botão cancelar
    if (fecharModalCancelar) {
        fecharModalCancelar.addEventListener("click", fecharModal);
    }


    // Salvar fornecedor
    salvarButton.addEventListener("click", () => {
        let codFornecedor = inputCod.value.trim();
        const nomeFornecedor = inputNome.value.trim();

        if (!nome) {
            alert("Preencha o nome do fornecedor!");
            return;
        }

        if (!codFornecedor) {
            codFornecedor = gerarCodAutomatico();
            campos.codFornecedor.value = codFornecedor;
        }

        if (modoEdicao) {
            atualizarFornecedor(fornecedorEditandoID);
        } else {
            criarFornecedor(nomeFornecedor, codFornecedor);
        }

        fecharModal();
    });

    function criarFornecedor(nomeFornecedor, codFornecedor) {

        const id = Date.now();

        const dadosFornecedor = {
            id,
            nomeFornecedor: campos.nomeFornecedor.value.trim(),
            emailFornecedor: campos.emailFornecedor.value.trim(),
            celularFornecedor: campos.celularFornecedor.value.trim(),
            fixoFornecedor: campos.fixoFornecedor.value.trim(),
            codFornecedor: campos.codFornecedor.value.trim(),
            endereco: campos.enderecoFornecedor.value.trim(),
            enderecoFornecedor: campos.cepFornecedor.value.trim(),
            numeroFornecedor: campos.numeroFornecedor.value.trim(),
            ufFornecedor: campos.ufFornecedor.value.trim(),
            bairroFornecedor: campos.bairroFornecedor.value.trim(),
            cidadeFornecedor: campos.cidadeFornecedor.value.trim(),
            complementoFornecedor: campos.complementoFornecedor.value.trim(),
            cnpjFornecedor: campos.cnpjFornecedor.value.trim()
        };

        const item = document.createElement("div");
        item.classList.add("info-item");
        item.setAttribute("data-id", id);
        item.dados = dadosFornecedor;

        item.innerHTML = `
            <span class="label">${dadosFornecedor.nomeFornecedor}</span>
            <span class="value-center">#${dadosFornecedor.codFornecedor}</span>
            <img src="/static/icons/editar_icon.svg" class="editar-icon">
        `;

        item.querySelector(".editar-icon").addEventListener("click", () => {
            abrirEdicao(id);
        });

        listaFornecedores.appendChild(item);
    }

    function abrirEdicao(id) {
        modoEdicao = true;
        fornecedorEditandoID = id;

        const item = document.querySelector(`[data-id="${id}"]`);
        const dados = item.dados;

        for (let campo in campos) {
            campos[campo].value = dados[campo] ?? "";
        }

        modalOverlay.style.display = "flex";
    }

    function atualizarFornecedor(id) {
        const item = document.querySelector(`[data-id="${id}"]`);
        const dados = item.dados;

        for (let campo in campos) {
            dados[campo] = campos[campo].value.trim();
        }

        item.querySelector(".label").innerText = dados.nomeFornecedor;
        item.querySelector(".value-center").innerText = "#" + dados.codFornecedor;
    }

    excluirButton.addEventListener("click", () => {
        if (!modoEdicao) return;

        const item = document.querySelector(`[data-id="${fornecedorEditandoID}"]`);
        if (item) item.remove();

        fecharModal();
    });

    // Gerar ID 

    function gerarCodAutomatico() {
        const itens = document.querySelectorAll(".info-item");

        if (itens.length === 0) return 1;

        let maior = 0;

        itens.forEach(item => {
            const cod = parseInt(item.dados.cod);
            if (!isNaN(cod) && cod > maior) maior = cod;
        });

        return maior + 1;
    }


    function limparInputs() {
        for (let campo in campos) {
            campos[campo].value = "";
        }
    }

});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("nomeFornecedor").addEventListener("input", function () {
        this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
    })

    document.getElementById("celularFornecedor").addEventListener("input", function () {
        let v = this.value.replace(/\D/g, "");

        if (v.length > 11) v = v.slice(0, 11);

        if (v.length > 6) {
            this.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
        } else if (v.length > 2) {
            this.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        } else {
            this.value = v;
        }
    });

    document.getElementById("fixoFornecedor").addEventListener("input", function () {
        let v = this.value.replace(/\D/g, "");

        if (v.length > 10) v = v.slice(0, 10);

        if (v.length > 6) {
            this.value = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
        } else if (v.length > 2) {
            this.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        } else {
            this.value = v;
        }
    });


    document.getElementById("cnpjFornecedor").addEventListener("input", function () {
        let value = this.value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d)/, "$1.$2");
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
        value = value.replace(/(\d{4})(\d)/, "$1-$2");

        this.value = value.slice(0, 18);
    });

    document.getElementById("cepFornecedor").addEventListener("input", function () {
        let v = this.value.replace(/\D/g, "");

        if (v.length > 8) v = v.slice(0, 8);

        if (v.length > 5) {
            this.value = `${v.slice(0, 5)}-${v.slice(5)}`;
        } else {
            this.value = v;
        }
    });


    document.getElementById("numeroFornecedor").addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
    });

    document.getElementById("ufFornecedor").addEventListener("input", function () {
        let value = this.value.replace(/[^A-Za-z]/g, "");
        this.value = value.toUpperCase().slice(0, 2);
    });
});


mascaraCelular(document.querySelector("#celularFornecedor"));
mascaraFixo(document.querySelector("#fixoFornecedor"));
mascaraUF(document.querySelector("#ufFornecedor"));