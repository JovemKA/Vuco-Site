// Variável para controlar se as perguntas foram embaralhadas
var paginaAtual = 1;
var totalPaginas = 0;
var perguntasSelecionadas = [];
var perguntasEmbaralhadas = [];
var respostasQuiz = {}; // Objeto para armazenar as respostas

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

    // Recupera a resposta selecionada pelo usuário, se existir
    var respostaSelecionada = respostasQuiz[perguntaNumero];

    // Se uma resposta foi salva previamente, seleciona-a novamente
    if (respostaSelecionada) {
      perguntaElement.setAttribute(
        "data-resposta",
        respostaSelecionada.opcaoSelecionada
      );
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
      opcaoItem.setAttribute("data-pergunta", perguntaNumero);
      opcaoItem.setAttribute(
        "data-opcao",
        String.fromCharCode(97 + opcaoIndex)
      );
      opcaoItem.setAttribute(
        "data-resposta",
        opcao.correta ? "correta" : "incorreta"
      );

      // Verifica se essa opção foi selecionada anteriormente
      if (
        respostaSelecionada &&
        respostaSelecionada.opcaoSelecionada ===
          String.fromCharCode(97 + opcaoIndex)
      ) {
        opcaoItem.innerHTML =
          '<input type="radio" name="q' +
          perguntaNumero +
          '" value="' +
          String.fromCharCode(97 + opcaoIndex) +
          '" checked="checked" /> ' +
          opcao.texto;
      } else {
        opcaoItem.innerHTML =
          '<input type="radio" name="q' +
          perguntaNumero +
          '" value="' +
          String.fromCharCode(97 + opcaoIndex) +
          '" /> ' +
          opcao.texto;
      }

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
}

// Função para avançar para a próxima página
function avancarPagina() {
  // Verifica se todas as perguntas foram respondidas antes de avançar
  var todasRespondidas = verificarTodasRespondidas();

  if (paginaAtual < totalPaginas && todasRespondidas) {
    paginaAtual++;
    exibirQuiz();
  } else if (!todasRespondidas) {
    alert("Por favor, responda a todas as perguntas antes de avançar.");
  }
}

// Função para retroceder para a página anterior
function retrocederPagina() {
  if (paginaAtual > 1) {
    paginaAtual--;
    exibirQuiz();
  }
}

// Adicione botões de navegação no HTML e adicione os event listeners correspondentes
document.getElementById("avancar-btn").addEventListener("click", avancarPagina);
document
  .getElementById("retroceder-btn")
  .addEventListener("click", retrocederPagina);

// Função para limpar as respostas armazenadas na memória
function limparRespostasArmazenadas() {
  respostasQuiz = {};
}

// Adicione um botão para limpar respostas no HTML
var limparBtn = document.createElement("button");
limparBtn.textContent = "Limpar Respostas";
limparBtn.addEventListener("click", limparRespostasArmazenadas);
document.getElementById("quiz-container").appendChild(limparBtn);

// Função para verificar se todas as perguntas foram respondidas
function verificarTodasRespondidas() {
  var todasRespondidas = true;
  document.querySelectorAll(".question").forEach(function (question) {
    var perguntaRespondida = question.querySelector("input:checked");
    if (!perguntaRespondida) {
      todasRespondidas = false;
      return;
    }
  });
  return todasRespondidas;
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
