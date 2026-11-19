const form = document.getElementById("registerForm");
const mensagemSucesso = document.getElementById("mensagem-sucesso");

// Escreve a mensagem de erro no <span> do campo. Devolve true se não há erro.
function setErro(idErro, texto) {
    document.getElementById(idErro).textContent = texto;
    return texto === "";
}

// Confere o formato e os dois dígitos verificadores do CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // remove tudo que não for número
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    for (let t = 9; t < 11; t++) {
        let soma = 0;
        for (let i = 0; i < t; i++) {
            soma += Number(cpf[i]) * (t + 1 - i);
        }
        const digito = ((soma * 10) % 11) % 10;
        if (digito !== Number(cpf[t])) return false;
    }
    return true;
}

form.addEventListener("submit", function (event) {
    event.preventDefault(); // impede o recarregamento da página
    mensagemSucesso.textContent = "";

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const cpf = document.getElementById("CPF").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();
    const evento = document.getElementById("Evento").value;
    const quantidade = Number(document.getElementById("quantidade").value);
    const pagamentoMarcado = document.querySelector('input[name="pagamento"]:checked');
    const termos = document.getElementById("termos").checked;

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    let valido = true;

    valido = setErro("erro-nome",
        nome.length < 3 || !nome.includes(" ")
            ? "Digite seu nome completo (nome e sobrenome)." : "") && valido;

    valido = setErro("erro-email",
        !emailValido ? "Digite um e-mail válido, como nome@exemplo.com." : "") && valido;

    valido = setErro("erro-senha",
        senha.length < 8 || senha.length > 12
            ? "A senha deve ter de 8 a 12 caracteres." : "") && valido;

    valido = setErro("erro-cpf",
        !validarCPF(cpf) ? "CPF inválido. Digite 11 números, com ou sem pontos e traço." : "") && valido;

    valido = setErro("erro-evento",
        evento === "" ? "Escolha um evento." : "") && valido;

    valido = setErro("erro-quantidade",
        !Number.isInteger(quantidade) || quantidade < 1 || quantidade > 10
            ? "Escolha de 1 a 10 ingressos." : "") && valido;

    valido = setErro("erro-pagamento",
        !pagamentoMarcado ? "Escolha uma forma de pagamento." : "") && valido;

    valido = setErro("erro-termos",
        !termos ? "Você precisa aceitar os termos para continuar." : "") && valido;

    if (!valido) return; // tem erro: para aqui e não salva nada

    // Recupera os cadastros já salvos (ou começa uma lista vazia)
    const cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];

    if (cadastros.some(function (c) { return c.email === email; })) {
        setErro("erro-email", "Este e-mail já está cadastrado.");
        return;
    }

    cadastros.push({
        nome: nome,
        email: email,
        cpf: cpf,
        mensagem: mensagem,
        evento: evento,
        quantidade: quantidade,
        pagamento: pagamentoMarcado.value
    });
    localStorage.setItem("cadastros", JSON.stringify(cadastros));

    mensagemSucesso.textContent = "Cadastro realizado com sucesso, " + nome.split(" ")[0] + "!";
    form.reset();
});