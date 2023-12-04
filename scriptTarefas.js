var tarefa = JSON.parse(localStorage.getItem('editTask'));
console.log(tarefa)

// Preencher o formulário no modal com os dados da tarefa
document.getElementById('inputTarefa').value = tarefa.titulo;
document.getElementById('inputDataInicio').value = tarefa.dataInicio;
document.getElementById('inputHoraInicio').value = tarefa.horaInicio;
document.getElementById('inputDataTermino').value = tarefa.dataTermino;
document.getElementById('inputHoraTermino').value = tarefa.horaTermino;
document.getElementById('inputDescricao').value = tarefa.descricao;

// Alteração na função alterarTarefaSubmit()
function alterarTarefaSubmit() {
    // Obter os novos valores dos campos do formulário
    var novoTitulo = document.getElementById('inputTarefa').value;
    var novaDataInicio = document.getElementById('inputDataInicio').value;
    var novaHoraInicio = document.getElementById('inputHoraInicio').value;
    var novaDataTermino = document.getElementById('inputDataTermino').value;
    var novaHoraTermino = document.getElementById('inputHoraTermino').value;
    var novaDescricao = document.getElementById('inputDescricao').value;

    // Salvar a tarefa modificada na localStorage
    const userLogged = JSON.parse(localStorage.getItem('usuarioLogado')).email;
    var usuarios = JSON.parse(localStorage.getItem('usuarios'));

    // Encontrar o usuário correto
    var usuarioExistente = usuarios.find(function (user) {
        return user.email === userLogged;
    });

    // Encontrar a tarefa dentro do usuário
    var idTarefa = JSON.parse(localStorage.getItem('editTaskIndex')).id;
    var tarefa = usuarioExistente.tarefas.find(function (task) {
        return task.id === idTarefa;
    });

    // Atualizar o status da tarefa com base nas novas datas
    tarefa.status = getStatusTarefaDois(tarefa);

    // Atualizar os dados da tarefa
    tarefa.titulo = novoTitulo;
    tarefa.dataInicio = novaDataInicio;
    tarefa.horaInicio = novaHoraInicio;
    tarefa.dataTermino = novaDataTermino;
    tarefa.horaTermino = novaHoraTermino;
    tarefa.descricao = novaDescricao;

    // Atualizar o array de tarefas do usuário
    usuarioExistente.tarefas = usuarioExistente.tarefas.map(function (task) {
        return task.id === idTarefa ? tarefa : task;
    });

    // Atualizar o array de usuários na localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Atualizar a página para a página de tarefas
    window.location.href="/logged.html"

}

// Função para remover a tarefa
function removerTarefa() {
    // Obter o ID da tarefa a ser removida
    var idTarefa = JSON.parse(localStorage.getItem('editTaskIndex')).id;

    // Obter o usuário logado
    const userLogged = JSON.parse(localStorage.getItem('usuarioLogado')).email;

    // Obter a lista de usuários da localStorage
    var usuarios = JSON.parse(localStorage.getItem('usuarios'));

    // Encontrar o usuário correto
    var usuarioExistente = usuarios.find(function (user) {
        return user.email === userLogged;
    });

    // Filtrar a lista de tarefas para criar uma nova sem a tarefa a ser removida
    usuarioExistente.tarefas = usuarioExistente.tarefas.filter(function (task) {
        return task.id !== idTarefa;
    });

    // Atualizar o array de usuários na localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Redirecionar para a página de tarefas ou fazer qualquer outra ação necessária
    window.location.href = "/logged.html";
}

function cancelarAcao() {
    window.location.href="/logged.html"
}

function trocarBotoes() {
    if (tarefa.status === "Realizada") {
        document.getElementById("btn-realizada").classList.add("d-none");
        document.getElementById("btn-NaoRealizada").classList.remove("d-none");
    } else {
        document.getElementById("btn-NaoRealizada").classList.add("d-none");
        document.getElementById("btn-realizada").classList.remove("d-none");
    }
}

// Função para marcar a tarefa como realizada
function marcarComoRealizada() {
    var idTarefa = JSON.parse(localStorage.getItem('editTaskIndex')).id;
    var usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    var usuarios = JSON.parse(localStorage.getItem('usuarios'));

    var usuarioExistente = usuarios.find(user => user.email === usuarioLogado.email);
    var tarefa = usuarioExistente.tarefas.find(task => task.id === idTarefa);

    if (tarefa) {
        tarefa.status = 'Realizada';
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        window.location.href = "/logged.html"; // Redireciona e atualiza a tabela
    } else {
        console.error('Tarefa não encontrada.');
    }
}

// Função para marcar a tarefa como não realizada
function marcarComoNaoRealizada() {
    var idTarefa = JSON.parse(localStorage.getItem('editTaskIndex')).id;
    var userLogged = JSON.parse(localStorage.getItem('usuarioLogado')).email;
    var usuarios = JSON.parse(localStorage.getItem('usuarios'));

    var usuarioExistente = usuarios.find(user => user.email === userLogged);
    var tarefa = usuarioExistente.tarefas.find(task => task.id === idTarefa);

    if (tarefa) {
        tarefa.status = getStatusTarefaDois(tarefa); // Redefine o status baseado nas datas
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        window.location.href = "/logged.html";
    } else {
        console.error('Tarefa não encontrada.');
    }
}

function getStatusTarefaDois(tarefa) {
    var momentoAtual = new Date();
    var dataInicio = new Date(tarefa.dataInicio + 'T' + tarefa.horaInicio);
    var dataTermino = new Date(tarefa.dataTermino + 'T' + tarefa.horaTermino);

    if (momentoAtual > dataTermino) {
        return 'Em atraso';
    } else if (momentoAtual < dataInicio) {
        return 'Pendente';
    } else {
        return 'Em andamento';
    }
}

trocarBotoes();