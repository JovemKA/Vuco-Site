// Variável para controlar a página atual e outras variáveis globais
var paginaAtual = 1;
var totalPaginas = 0;
var totalPerguntas = 0;
var perguntasSelecionadas = [];
var perguntasEmbaralhadas = [];
var respostasQuiz = {};

// Função para embaralhar as perguntas apenas uma vez
function embaralharPerguntas() {
  perguntasEmbaralhadas = shuffleArray(perguntasSelecionadas);
}

// Função para exibir o quiz na interface do usuário
function exibirQuiz() {
  var quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "";
  var indiceInicial = (paginaAtual - 1) * 5;
  var indiceFinal = Math.min(indiceInicial + 5, perguntasSelecionadas.length);

  for (var i = indiceInicial; i < indiceFinal; i++) {
    var pergunta = perguntasEmbaralhadas[i];
    var perguntaNumero = i + 1;

    var perguntaElement = document.createElement("div");
    perguntaElement.classList.add("question");
    perguntaElement.setAttribute("data-pergunta", perguntaNumero);

    var respostaSelecionada = respostasQuiz[perguntaNumero]?.opcaoSelecionada;

    perguntaElement.innerHTML =
      "<h3>" + perguntaNumero + ". " + pergunta.pergunta + "</h3>";

    if (pergunta.imagem) {
      var imagemElement = document.createElement("img");
      imagemElement.src = pergunta.imagem;
      imagemElement.alt = "Imagem da pergunta " + perguntaNumero;
      perguntaElement.appendChild(imagemElement);
    }

    var opcoesList = document.createElement("ul");
    opcoesList.classList.add("options");

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

    perguntaElement.appendChild(opcoesList);

    var feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add("feedback");
    feedbackDiv.id = "feedback" + perguntaNumero;
    perguntaElement.appendChild(feedbackDiv);

    quizContainer.appendChild(perguntaElement);

    if (respostasQuiz[perguntaNumero]) {
      exibirFeedback(perguntaNumero, respostaSelecionada, respostasQuiz[perguntaNumero].resposta);
    }
  }

  document.querySelectorAll(".option").forEach(function (option) {
    option.addEventListener("click", function () {
      var pergunta = this.getAttribute("data-pergunta");
      var opcaoSelecionada = this.getAttribute("data-opcao");
      var resposta = this.getAttribute("data-resposta");

      exibirFeedback(pergunta, opcaoSelecionada, resposta);

      respostasQuiz[pergunta] = {
        opcaoSelecionada: opcaoSelecionada,
        resposta: resposta
      };
    });
  });
}

function limparRespostasArmazenadas() {
  respostasQuiz = {};
  paginaAtual = 1; // Reset the current page to 1 when clearing answers
  exibirQuiz(); // Re-render the quiz to reflect cleared answers
}

var limparBtn = document.createElement("button");
limparBtn.textContent = "Limpar Respostas";
limparBtn.addEventListener("click", limparRespostasArmazenadas);
document.getElementById("quiz-container").appendChild(limparBtn);

function avancarPagina() {
  var todasRespondidas = verificarTodasRespondidas();

  if (paginaAtual < totalPaginas && todasRespondidas) {
    paginaAtual++;
    exibirQuiz();
    window.scrollTo(0, 0);
    exibirPontuacaoFinal();
  // } else if (!todasRespondidas) {
  //   alert("Por favor, responda a todas as perguntas antes de avançar.");
  // } else if (paginaAtual === totalPaginas) {
  //   exibirPontuacaoFinal();
  }
}

function retrocederPagina() {
  if (paginaAtual > 1) {
    paginaAtual--;
    exibirQuiz();
    window.scrollTo(0, 0);
  }
}

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

function calcularPontuacao() {
  let pontuacao = 0;
  for (const resposta in respostasQuiz) {
    if (respostasQuiz[resposta].resposta === "correta") {
      pontuacao++;
    }
  }
  return pontuacao;
}

function exibirPontuacaoFinal() {
  var pontuacaoFinal = calcularPontuacao();
  var modal = document.getElementById("scoreModal");
  var modalTitle = document.getElementById("modal-title");
  var modalMessage = document.getElementById("modal-message");
  var restartButton = document.getElementById("restart-button");
  var homeButton = document.getElementById("home-button");

  // Definindo a mensagem e o título com base na pontuação
  if (pontuacaoFinal >= 18) {
    modalTitle.innerHTML = '🏆 Excelente!';
    modalMessage.innerHTML = 'Sua pontuação final é ' + pontuacaoFinal + ' de ' + totalPerguntas + '.<br><br>Você conhece profundamente a cultura do Recife! Parabéns pelo seu excelente desempenho! 🌟';
  } else if (pontuacaoFinal >= 14) {
    modalTitle.innerHTML = '🎉 Bom trabalho!';
    modalMessage.innerHTML = 'Sua pontuação final é ' + pontuacaoFinal + ' de ' + totalPerguntas + '.<br><br>Você tem um bom conhecimento sobre a cultura do Recife. Continue assim e você se tornará um expert! 🏖️';
  } else if (pontuacaoFinal >= 8) {
    modalTitle.innerHTML = '🌟 Razoável!';
    modalMessage.innerHTML = 'Sua pontuação final é ' + pontuacaoFinal + ' de ' + totalPerguntas + '.<br><br>Você tem um conhecimento básico sobre a cultura do Recife. Que tal aprender mais e tentar novamente? 📚';
  } else {
    modalTitle.innerHTML = '💪 Continue tentando!';
    modalMessage.innerHTML = 'Sua pontuação final é ' + pontuacaoFinal + ' de ' + totalPerguntas + '.<br><br>Não desanime! Recife tem muito a oferecer e aprender sobre sua cultura é uma jornada. Vamos tentar novamente? 🌍';
  }

  modal.style.display = "flex"; // Altera o estilo para flex

  // Definir evento de clique para fechar o modal
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.style.display = "none";
  }

   // Botão para reiniciar o quiz
   restartButton.onclick = function() {
    modal.style.display = "none";
    paginaAtual = 1; // Reinicia a página atual
    // perguntasSelecionadas = perguntasEmbaralhadas.slice(); // Reinicia as perguntas
    // embaralharPerguntas(); // Embaralha as perguntas
    // exibirQuiz(); // Exibe o quiz
    limparRespostasArmazenadas(); // Limpa as respostas armazenadas
    window.scrollTo(0, 0); // Rolagem para o topo da página
  }

  // Botão para concluir e voltar para a home
  homeButton.onclick = function() {
    modal.style.display = "none";
    window.location.href = "index.html";
  }

  // Fecha o modal se clicar fora da área do modal
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}


function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function exibirFeedback(pergunta, opcaoSelecionada, resposta) {
  var feedbackDiv = document.getElementById("feedback" + pergunta);
  document.querySelector(
    '.option[data-pergunta="' +
      pergunta +
      '"][data-opcao="' +
      opcaoSelecionada +
      '"] input'
  ).checked = true;

  document
    .querySelectorAll('.option[data-pergunta="' + pergunta + '"]')
    .forEach(function (opt) {
      opt.classList.remove("correct", "incorrect");
    });

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
    var respostaCorreta = document
      .querySelector(
        '.option[data-pergunta="' + pergunta + '"][data-resposta="correta"]'
      );
    feedbackDiv.innerHTML =
      "<span class='incorrect'>&#x2718; Errado! A resposta correta era: " +
      respostaCorreta.innerText +
      "</span>";
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

fetch("data/perguntas.json")
  .then((response) => response.json())
  .then((data) => {
    perguntasSelecionadas = data;
    totalPerguntas = perguntasSelecionadas.length;
    embaralharPerguntas();
    totalPaginas = Math.ceil(perguntasSelecionadas.length / 5);
    exibirQuiz();
  })
  .catch((error) => console.error("Erro ao carregar as perguntas:", error));

document.getElementById("avancar-btn").addEventListener("click", avancarPagina);
document.getElementById("retroceder-btn").addEventListener("click", retrocederPagina);
