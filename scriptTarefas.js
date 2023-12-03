var tarefa = JSON.parse(localStorage.getItem('editTask'));

    // Preencher o formulário no modal com os dados da tarefa
    document.getElementById('inputTarefa').value = tarefa.titulo;
    document.getElementById('inputDataInicio').value = tarefa.dataInicio;
    document.getElementById('inputHoraInicio').value = tarefa.horaInicio;
    document.getElementById('inputDataTermino').value = tarefa.dataTermino;
    document.getElementById('inputHoraTermino').value = tarefa.horaTermino;
    document.getElementById('inputDescricao').value = tarefa.descricao;