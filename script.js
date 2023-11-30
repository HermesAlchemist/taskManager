// <!-- Script JavaScript -->
    // Função para criar um usuário
    function criarUsuario() {
        var nome = document.getElementById('nomeUsuario').value;
        var email = document.getElementById('cadastroEmail').value;
        var senha = document.getElementById('cadastroSenha').value;

        var usuario = {
            nome: nome,
            email: email,
            senha: senha,
            tarefas: [] // Inicializa as tarefas como uma lista vazia
        };

        localStorage.setItem('usuario', JSON.stringify(usuario));

        return false; // Impede o formulário de ser enviado
    }

    // Função para fazer login
    function fazerLogin(event) {
        event.preventDefault()
        var email = document.getElementById('loginEmail').value;
        var senha = document.getElementById('loginSenha').value;

        // Obtém o usuário do localStorage
        var usuario = JSON.parse(localStorage.getItem('usuario'));

        // Verifica se o usuário existe e a senha está correta
        if (usuario && usuario.email === email && usuario.senha === senha) {
            // Login bem-sucedido / ALERT
            alert("Login feito com sucesso!");

            // Atualiza o texto da barra de navegação com o nome do usuário
            // Redireciona para a página logged.html
            window.location.href = 'http://127.0.0.1:5500/logged.html';
        } else {
            // Login falhou
            alert('Login falhou. Verifique suas credenciais.');
        }

        return false; // Impede o formulário de ser enviado
    }

    // Função para atualizar o texto da barra de navegação
    function atualizarTextoNavbar() {
        var usuario = JSON.parse(localStorage.getItem('usuario'));

        // Verificar se o usuário está definido para evitar erros
        if (usuario && usuario.nome) {

            document.querySelector('.navbar-brand').innerHTML = `Bem-vindo, ${usuario.nome}!`;
        } else {
            console.error('Usuário não encontrado ou nome não definido.');
        }
    }

    // Função para criar uma tarefa e associá-la ao usuário
    function criarTarefa() {
        // Obter os valores dos campos
        var tarefa = document.getElementById('inputTarefa').value;
        var dataInicio = document.getElementById('inputDataInicio').value;
        var horaInicio = document.getElementById('inputHoraInicio').value;
        var dataTermino = document.getElementById('inputDataTermino').value;
        var horaTermino = document.getElementById('inputHoraTermino').value;
        var descricao = document.getElementById('inputDescricao').value;

        // Obter o usuário do localStorage
        var usuario = JSON.parse(localStorage.getItem('usuario')) || { tarefas: [] };

        // Criar a nova tarefa
        var novaTarefa = {
            titulo: tarefa,
            descricao: descricao,
            dataInicio: dataInicio,
            horaInicio: horaInicio,
            dataTermino: dataTermino,
            horaTermino: horaTermino
        };

        // Adicionar a nova tarefa à lista de tarefas do usuário
        usuario.tarefas.push(novaTarefa);

        // Atualizar os dados do usuário no localStorage
        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Criar uma nova linha na tabela
        var tableBody = document.getElementById('tarefasTableBody');
        var newRow = tableBody.insertRow();
        newRow.innerHTML = `<td class="col-5"><a href="#" onclick="exibirDescricao('${tarefa}', '${descricao}')" data-bs-toggle="modal" data-bs-target="#exampleModal">${tarefa}</a></td>
                            <td class="col-2">${dataInicio} ${horaInicio}</td>
                            <td class="col-2">${dataTermino} ${horaTermino}</td>
                            <td class="col-2">Status</td>
                            <td class="col-1">Alterar</td>`;

        // Fechar o modal após criar a tarefa
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
        myModal.hide();
    }

    // Função para exibir a descrição no modal
    function exibirDescricao(titulo, descricao) {
        document.getElementById('modalDescricao').innerHTML = `<h1>${titulo}</h1><p>${descricao}</p>`;
    }

    atualizarTextoNavbar();