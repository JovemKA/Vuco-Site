// Variável para controlar se as perguntas foram embaralhadas
var paginaAtual = 1;
var totalPaginas = 0;
var perguntasSelecionadas = [];
var perguntasEmbaralhadas = [];
// Cria um objeto para armazenar as respostas
var respostasQuiz = {};

// Função para embaralhar as perguntas apenas uma vez
function embaralharPerguntas() {
  perguntasEmbaralhadas = shuffleArray(perguntasSelecionadas);
}

// Função para exibir o quiz na interface do usuário
function exibirQuiz() {
  // Recupera as respostas previamente selecionadas pelo usuário, se existirem
  var respostasSalvas = JSON.parse(localStorage.getItem(respostasQuiz)) || {};

  var quizContainer = document.getElementById("quiz-container");

  // Limpa o conteúdo do contêiner do quiz antes de exibir as novas perguntas
  quizContainer.innerHTML = "";

  // Calcula o índice inicial e final do grupo de perguntas a ser exibido
  var indiceInicial = (paginaAtual - 1) * 5;
  var indiceFinal = Math.min(indiceInicial + 5, perguntasSelecionadas.length);

  for (var i = indiceInicial; i < indiceFinal; i++) {
    var pergunta = perguntasEmbaralhadas[i];
    var perguntaNumero = i + 1;

    // Cria um elemento para a pergunta
    var perguntaElement = document.createElement("div");
    perguntaElement.classList.add("question");
    perguntaElement.setAttribute("data-pergunta", perguntaNumero);

    var respostaSelecionada = respostasSalvas[perguntaNumero];

    // Se uma resposta foi salva previamente, seleciona-a novamente
    if (respostaSelecionada) {
      perguntaElement.setAttribute("data-resposta", respostaSelecionada);
    }

    perguntaElement.innerHTML =
      "<h3>" + perguntaNumero + ". " + pergunta.pergunta + "</h3>";

    // Cria uma lista de opções de resposta
    var opcoesList = document.createElement("ul");
    opcoesList.classList.add("options");

    // Adiciona cada opção de resposta à lista
    pergunta.opcoes.forEach(function (opcao, opcaoIndex) {
      var opcaoItem = document.createElement("li");
      opcaoItem.classList.add("option");
      opcaoItem.setAttribute("data-pergunta", perguntaNumero); // Adiciona um atributo para identificar a pergunta
      opcaoItem.setAttribute(
        "data-opcao",
        String.fromCharCode(97 + opcaoIndex)
      ); // Adiciona um atributo para identificar a opção (a, b, c, ...)
      opcaoItem.setAttribute(
        "data-resposta",
        opcao.correta ? "correta" : "incorreta"
      ); // Adiciona um atributo para identificar se a resposta é correta
      opcaoItem.innerHTML =
        '<input type="radio" name="q' +
        perguntaNumero +
        '" value="' +
        String.fromCharCode(97 + opcaoIndex) +
        '" ' +
        (respostaSelecionada === String.fromCharCode(97 + opcaoIndex)
          ? 'checked="checked"'
          : "") +
        " /> " + // Se essa opção foi selecionada anteriormente, marca o radio
        opcao.texto;
      opcoesList.appendChild(opcaoItem);
    });

    // Adiciona a lista de opções à pergunta
    perguntaElement.appendChild(opcoesList);

    // Adiciona o espaço para feedback
    var feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add("feedback");
    feedbackDiv.id = "feedback" + perguntaNumero;
    perguntaElement.appendChild(feedbackDiv);

    // Adiciona a pergunta ao contêiner do quiz
    quizContainer.appendChild(perguntaElement);
  }

  // Adiciona um evento de clique para cada opção de resposta
  document.querySelectorAll(".option").forEach(function (option) {
    option.addEventListener("click", function () {
      var pergunta = this.getAttribute("data-pergunta"); // Obtém o número da pergunta
      var opcaoSelecionada = this.getAttribute("data-opcao"); // Obtém o número da opção selecionada
      var resposta = this.getAttribute("data-resposta"); // Obtém se a resposta é correta ou não

      exibirFeedback(pergunta, opcaoSelecionada, resposta);
    });
  });
}

// Função para limpar as respostas armazenadas na memória
function limparRespostasArmazenadas() {
  respostasQuiz = {};
}

// Adicione um botão para limpar respostas no HTML
var limparBtn = document.createElement("button");
limparBtn.textContent = "Limpar Respostas";
limparBtn.addEventListener("click", limparRespostasArmazenadas);
document.getElementById("quiz-container").appendChild(limparBtn);

// Função para avançar para a próxima página
function avancarPagina() {
  // Verifica se todas as perguntas foram respondidas antes de avançar
  // var todasRespondidas = verificarTodasRespondidas();

  if (paginaAtual < totalPaginas /* && todasRespondidas*/) {
    paginaAtual++;
    exibirQuiz();
    window.scrollTo(0, 0);
  }
  // else if (!todasRespondidas) {
  //   alert("Por favor, responda a todas as perguntas antes de avançar.");
  // }
}

// Função para retroceder para a página anterior
function retrocederPagina() {
  if (paginaAtual > 1) {
    paginaAtual--;
    exibirQuiz();
    window.scrollTo(0, 0); // Move para o topo do site
  }
}

// Função para salvar as respostas
function salvarRespostas() {
  document.querySelectorAll(".option").forEach(function (option) {
    option.addEventListener("click", function () {
      var pergunta = this.getAttribute("data-pergunta"); // Obtém o número da pergunta
      var opcaoSelecionada = this.getAttribute("data-opcao"); // Obtém o número da opção selecionada
      var resposta = this.getAttribute("data-resposta"); // Obtém se a resposta é correta ou não

      // Armazena a resposta no objeto respostasQuiz
      respostasQuiz[pergunta] = {
        opcaoSelecionada: opcaoSelecionada,
        resposta: resposta,
      };
    });
  });
}

// Adicione botões de navegação no HTML e adicione os event listeners correspondentes
document.getElementById("avancar-btn").addEventListener("click", avancarPagina);
document
  .getElementById("retroceder-btn")
  .addEventListener("click", retrocederPagina);

// Função para embaralhar um array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// Função para exibir feedback
function exibirFeedback(pergunta, opcaoSelecionada, resposta) {
  // Obtém o elemento de feedback para esta pergunta
  var feedbackDiv = document.getElementById("feedback" + pergunta);

  // Altera a seleção da alternativa
  document.querySelector(
    '.option[data-pergunta="' +
      pergunta +
      '"][data-opcao="' +
      opcaoSelecionada +
      '"] input'
  ).checked = true;

  // Remove as classes de feedback anteriores das opções da mesma pergunta
  document
    .querySelectorAll('.option[data-pergunta="' + pergunta + '"]')
    .forEach(function (opt) {
      opt.classList.remove("correct", "incorrect");
    });

  // Verifica se a resposta selecionada está correta
  if (resposta === "correta") {
    feedbackDiv.innerHTML = "<span class='correct'>&#x2714; Correto!</span>";
    document
      .querySelector(
        '.option[data-pergunta="' +
          pergunta +
          '"][data-opcao="' +
          opcaoSelecionada +
          '"]'
      )
      .classList.add("correct");
  } else {
    // Obtém a letra da opção correta
    var respostaCorreta = document
      .querySelector(
        '.option[data-pergunta="' + pergunta + '"][data-resposta="correta"]'
      )
      .getAttribute("data-opcao");
    feedbackDiv.innerHTML =
      "<span class='incorrect'>&#x2718; Errado! A resposta correta era: " +
      respostaCorreta.toLowerCase() +
      ") </span>";
    document
      .querySelector(
        '.option[data-pergunta="' +
          pergunta +
          '"][data-opcao="' +
          opcaoSelecionada +
          '"]'
      )
      .classList.add("incorrect");
  }
}

// // Função para verificar se todas as perguntas foram respondidas
// function verificarTodasRespondidas() {
//   var totalPerguntas = perguntasSelecionadas.length;
//   var todasRespondidas = true;
//   for (var i = 1; i <= totalPerguntas; i++) {
//     if (!respostasQuiz[i]) {
//       todasRespondidas = false;
//       break;
//     }
//   }
//   return todasRespondidas;
// }

// Carrega o arquivo JSON com as perguntas
// Neste exemplo, assumimos que o arquivo JSON está na mesma pasta e se chama "perguntas.json"
fetch("data/perguntas.json")
  .then((response) => response.json())
  .then((data) => {
    // Seleciona aleatoriamente as perguntas e embaralha apenas uma vez
    perguntasSelecionadas = data;
    embaralharPerguntas();

    totalPaginas = Math.ceil(perguntasSelecionadas.length / 5);

    // Exibe o quiz com as perguntas selecionadas
    exibirQuiz();
  })
  .catch((error) => console.error("Erro ao carregar as perguntas:", error));
