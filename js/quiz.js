// Variável para controlar a página atual e outras variáveis globais
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

    var respostaSelecionada = respostasQuiz[perguntaNumero]?.opcaoSelecionada;

    perguntaElement.innerHTML =
      "<h3>" + perguntaNumero + ". " + pergunta.pergunta + "</h3>";

    // Cria uma lista de opções de resposta
    var opcoesList = document.createElement("ul");
    opcoesList.classList.add("options");

    // Adiciona cada opção de resposta à lista
    pergunta.opcoes.forEach(function (opcao, opcaoIndex) {
      var opcaoItem = document.createElement("li");
      opcaoItem.classList.add("option");
      opcaoItem.setAttribute("data-pergunta", perguntaNumero);
      opcaoItem.setAttribute("data-opcao", String.fromCharCode(97 + opcaoIndex));
      opcaoItem.setAttribute("data-resposta", opcao.correta ? "correta" : "incorreta");
      opcaoItem.innerHTML =
        '<input type="radio" name="q' +
        perguntaNumero +
        '" value="' +
        String.fromCharCode(97 + opcaoIndex) +
        '" ' +
        (respostaSelecionada === String.fromCharCode(97 + opcaoIndex) ? 'checked="checked"' : "") +
        " /> " +
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
      var pergunta = this.getAttribute("data-pergunta");
      var opcaoSelecionada = this.getAttribute("data-opcao");
      var resposta = this.getAttribute("data-resposta");

      exibirFeedback(pergunta, opcaoSelecionada, resposta);

      // Armazena a resposta no objeto respostasQuiz
      respostasQuiz[pergunta] = {
        opcaoSelecionada: opcaoSelecionada,
        resposta: resposta
      };
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
  // Verifica se todas as perguntas da página atual foram respondidas antes de avançar
  var todasRespondidas = verificarTodasRespondidas();

  if (paginaAtual < totalPaginas && todasRespondidas) {
    paginaAtual++;
    exibirQuiz();
    window.scrollTo(0, 0); // Rolagem da página para o topo
  } else if (!todasRespondidas) {
    alert("Por favor, responda a todas as perguntas antes de avançar.");
  }
}

// Função para retroceder para a página anterior
function retrocederPagina() {
  if (paginaAtual > 1) {
    paginaAtual--;
    exibirQuiz();
    window.scrollTo(0, 0); // Move para o topo do site
  }
}

// Função para verificar se todas as perguntas da página atual foram respondidas
function verificarTodasRespondidas() {
  var todasRespondidas = true;
  var indiceInicial = (paginaAtual - 1) * 5;
  var indiceFinal = Math.min(indiceInicial + 5, perguntasSelecionadas.length);

  for (var i = indiceInicial; i < indiceFinal; i++) {
    var perguntaNumero = i + 1;
    if (!respostasQuiz[perguntaNumero]) {
      todasRespondidas = false;
      break;
    }
  }
  return todasRespondidas;
}

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

function navBar() {
  let nav = document.querySelector(".nav");
  if (nav.classList.contains("open")) {
    nav.classList.remove("open");
  } else {
    nav.classList.add("open");
  }
}

// Adiciona botões de navegação no HTML e adiciona os event listeners correspondentes
document.getElementById("avancar-btn").addEventListener("click", avancarPagina);
document.getElementById("retroceder-btn").addEventListener("click", retrocederPagina);
