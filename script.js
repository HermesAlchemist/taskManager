    // Função para criar um usuário
    function criarUsuario(event) {
        event.preventDefault();

        var nome = document.getElementById('nomeUsuario').value;
        var email = document.getElementById('cadastroEmail').value;
        var senha = document.getElementById('cadastroSenha').value;

        // Obter usuários existentes do localStorage
        var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        // Verificar se o email já está cadastrado
        var usuarioExistente = usuarios.find(function (user) {
            return user.email === email;
        });

        if (usuarioExistente) {
            alert('Este e-mail já está cadastrado. Por favor, use outro e-mail.');
            return false;
        }

        var novoUsuario = {
            nome: nome,
            email: email,
            senha: senha,
            tarefas: [] // Inicializa as tarefas como uma lista vazia
        };

        // Adicionar o novo usuário à lista de usuários
        usuarios.push(novoUsuario);

        // Salvar a lista atualizada no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert('Cadastro realizado com sucesso!');
        // Você pode redirecionar para a página de login ou outra página se desejar

        return false; // Impede o formulário de ser enviado
    }

    // Função para fazer login
    function fazerLogin(event) {
        event.preventDefault();

        var email = document.getElementById('loginEmail').value;
        var senha = document.getElementById('loginSenha').value;

        // Obter usuários existentes do localStorage
        var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        // Procurar o usuário com o email fornecido
        var usuario = usuarios.find(function (user) {
            return user.email === email && user.senha === senha;
        });

        // Verificar se o usuário existe e a senha está correta
        if (usuario) {
            // Login bem-sucedido

            // Armazenar o usuário logado no localStorage
            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

            alert('Login feito com sucesso!');

            // Redirecionar para a página logada ou outra página, se desejar
            window.location.href = '/logged.html';
        } else {
            // Login falhou
            alert('Login falhou. Verifique suas credenciais.');
        }

        return false; // Impede o formulário de ser enviado
    }

    // Função para atualizar o texto da barra de navegação
    function atualizarTextoNavbar() {
        var usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        var navbarBrand = document.querySelector('.navbar-brand');
        var btnSair = document.querySelector('#btnSair');

        if (usuarioLogado && usuarioLogado.nome) {
            navbarBrand.innerHTML = `Bem-vindo, ${usuarioLogado.nome}!`;
            
            // Adicionar evento de clique ao botão "Sair"
            btnSair.addEventListener('click', fazerLogout);
        } else {
            console.error('Usuário não encontrado ou nome não definido.');
        }
    }


    // Função para criar uma tarefa e associá-la ao usuário
// Alteração em criarTarefa()
function criarTarefa(event) {
    event.preventDefault();

    // Obter os valores dos campos
    var tarefa = document.getElementById('inputTarefa').value;
    var dataInicio = document.getElementById('inputDataInicio').value;
    var horaInicio = document.getElementById('inputHoraInicio').value;
    var dataTermino = document.getElementById('inputDataTermino').value;
    var horaTermino = document.getElementById('inputHoraTermino').value;
    var descricao = document.getElementById('inputDescricao').value;

    // Obter a lista completa de usuários do localStorage
    var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Encontrar o usuário logado na lista de usuários
    var usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    var usuario = usuarios.find(function (user) {
        return user.email === usuarioLogado.email;
    });

    if (usuario) {
        // Criar a nova tarefa com status 'Pendente'
        var novaTarefa = {
            titulo: tarefa,
            descricao: descricao,
            dataInicio: dataInicio,
            horaInicio: horaInicio,
            dataTermino: dataTermino,
            horaTermino: horaTermino,
            status: false, // Adicionado o status 'Pendente'
            id: Math.random()*1000000
        };

        // Adicionar a nova tarefa à lista de tarefas do usuário
        usuario.tarefas.push(novaTarefa);

        // Atualizar os dados do usuário no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        // Atualizar a tabela de tarefas na página
        atualizarTabelaTarefas();

        // Fechar o modal após criar a tarefa
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
        myModal.hide();
    } else {
        console.error('Usuário não encontrado na lista de usuários.');
    }
}
    
// Alteração em atualizarTabelaTarefas()
function atualizarTabelaTarefas() {
    var usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    var usuario = usuarios.find(function (user) {
        return user.email === usuarioLogado.email;
    });

    if (usuario) {
        var tableBody = document.getElementById('tarefasTableBody');
        tableBody.innerHTML = ''; // Limpar tabela antes de atualizar

        usuario.tarefas.forEach(function (tarefa) {
            var newRow = tableBody.insertRow();

            newRow.innerHTML = `<td class="col-5 text-white"><a href="#" onclick="exibirDescricao('${tarefa.titulo}', '${tarefa.descricao}')" data-bs-toggle="modal" data-bs-target="#exampleModal">${tarefa.titulo}</a></td>
                                 <td class="col-2">${tarefa.dataInicio} ${tarefa.horaInicio}</td>
                                 <td class="col-2">${tarefa.dataTermino} ${tarefa.horaTermino}</td>
                                 <td class="col-2 ${getStatusTarefa(tarefa)}">${getStatusTarefa(tarefa)}</td>
                                 <td class="col-1">
                                     <button class="btn btn-primary" onclick="pageEditTask(${tarefa.id})">Alterar</button>
                                 </td>`;
                                conteudoStatus(getStatusTarefa(tarefa))
                                });
    } else {
        console.error('Usuário não encontrado na lista de usuários.');
    }
}

function conteudoStatus(status) {
if (status === "text-em-andamento") {
    document.querySelector(".text-realizada").forEach(element => {
        element.innerText = "Realizada";
    });
}
}

// Função para obter o status da tarefa
function getStatusTarefa(tarefa) {
    var momentoAtual = new Date();
    var dataInicio = new Date(tarefa.dataInicio + 'T' + tarefa.horaInicio);
    var dataTermino = new Date(tarefa.dataTermino + 'T' + tarefa.horaTermino);

    if (tarefa.status === true) {
        return 'text-realizada';
    } else if (momentoAtual > dataTermino) {
        return 'text-em-atraso';
    } else if (momentoAtual < dataInicio) {
        return 'text-pendente';
    } else {
        return 'text-em-andamento';
    }
}



    // Função para exibir a descrição no modal
    function exibirDescricao(titulo, descricao) {
        document.getElementById('exampleModalLabel').innerHTML = `<h1>${titulo}</h1>`;
        document.getElementById('modalDescricao').innerHTML = `<p>${descricao}</p>`;        
    }

    // Função para fazer logout
    function fazerLogout() {
    // Remover o usuário logado do localStorage
    localStorage.removeItem('usuarioLogado');

    // Redirecionar para a página de login (index.html)
    window.location.href = 'index.html';
    }
    
// Alteração na função alterarTarefa()
function alterarTarefa(titulo) {
    var usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    var usuario = usuarios.find(function (user) {
        return user.email === usuarioLogado.email;
    });

    if (usuario) {
        // Encontrar a tarefa pelo título
        var tarefa = usuario.tarefas.find(function (t) {
            return t.titulo === titulo;
        });

        if (tarefa) {
            // Preencher o formulário no modal com os dados da tarefa
            document.getElementById('inputTarefaModal').value = tarefa.titulo;
            document.getElementById('inputDataInicioModal').value = tarefa.dataInicio;
            document.getElementById('inputHoraInicioModal').value = tarefa.horaInicio;
            document.getElementById('inputDataTerminoModal').value = tarefa.dataTermino;
            document.getElementById('inputHoraTerminoModal').value = tarefa.horaTermino;
            document.getElementById('inputDescricaoModal').value = tarefa.descricao;

            // Exibir os botões de ação no modal
            document.getElementById('btnAlterar').style.display = 'block';
            document.getElementById('btnRemover').style.display = 'block';
            document.getElementById('btnMarcarRealizada').style.display = tarefa.status === 'Pendente' ? 'block' : 'none';
            document.getElementById('btnMarcarNaoRealizada').style.display = tarefa.status === 'Realizada' ? 'block' : 'none';
            document.getElementById('btnCancelar').style.display = 'block';

            // Exibir o modal
            var myModal = new bootstrap.Modal(document.getElementById('modalAlterarTarefa'));
            myModal.show();
        } else {
            console.error('Tarefa não encontrada.');
        }
    } else {
        console.error('Usuário não encontrado na lista de usuários.');
    }
}

// Edit starting function
function pageEditTask(id) {
    var usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    var usuario = usuarios.find(function (user) {
        return user.email === usuarioLogado.email;
    });
    
    if (usuario) {
        // Encontrar a tarefa pelo título
        var tarefa = usuario.tarefas.find(function (item) {
            return item.id === id;
        });

        if (tarefa) {
            const taskDetails = {
                id: tarefa.id,
                titulo: tarefa.titulo,
                dataInicio: tarefa.dataInicio,
                dataTermino: tarefa.dataTermino,
                horaInicio: tarefa.horaInicio,
                horaTermino: tarefa.horaTermino,
                descricao: tarefa.descricao,
                status: tarefa.status
            };

            const idTarefaAtual = {
                id: tarefa.id
            };

            const currentTaskIndexString = JSON.stringify(idTarefaAtual);
            localStorage.setItem("editTaskIndex", currentTaskIndexString);

            const taskDetailsString = JSON.stringify(taskDetails);
            localStorage.setItem("editTask", taskDetailsString);

            window.location.replace("/editTask.html");
        } else {
            console.error('Tarefa não encontrada.');
        }
    } else {
        console.error('Usuário não encontrado na lista de usuários.');
    }
}


atualizarTextoNavbar();
atualizarTabelaTarefas();