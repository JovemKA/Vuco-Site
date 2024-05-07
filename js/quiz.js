// Função para exibir o quiz na interface do usuário
function exibirQuiz(perguntas) {
  var quizContainer = document.getElementById("quiz-container");

  perguntas.forEach(function (pergunta, index) {
    // Cria um elemento para a pergunta
    var perguntaElement = document.createElement("div");
    perguntaElement.classList.add("question");
    perguntaElement.innerHTML =
      "<h3>" + (index + 1) + ". " + pergunta.pergunta + "</h3>";

    // Cria uma lista de opções de resposta
    var opcoesList = document.createElement("ul");
    opcoesList.classList.add("options");

    // Embaralha as opções de resposta
    var opcoesEmbaralhadas = shuffleArray(pergunta.opcoes);

    // Adiciona cada opção de resposta à lista
    opcoesEmbaralhadas.forEach(function (opcao, opcaoIndex) {
      var opcaoItem = document.createElement("li");
      opcaoItem.classList.add("option");
      opcaoItem.setAttribute("data-pergunta", index + 1); // Adiciona um atributo para identificar a pergunta
      opcaoItem.setAttribute(
        "data-opcao",
        String.fromCharCode(97 + opcaoIndex)
      ); // Adiciona um atributo para identificar a opção (a, b, c, ...)
      opcaoItem.setAttribute(
        "data-resposta",
        pergunta.resposta_correta.toLowerCase()
      ); // Adiciona um atributo para identificar a resposta correta
      opcaoItem.innerHTML =
        '<input type="radio" name="q' +
        (index + 1) +
        '" value="' +
        String.fromCharCode(97 + opcaoIndex) + // Define o valor como a letra correspondente (a, b, c, ...)
        '" /> ' +
        opcao;
      opcoesList.appendChild(opcaoItem);
    });

    // Adiciona a lista de opções à pergunta
    perguntaElement.appendChild(opcoesList);

    // Adiciona o espaço para feedback
    var feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add("feedback");
    feedbackDiv.id = "feedback" + (index + 1);
    perguntaElement.appendChild(feedbackDiv);

    // Adiciona a pergunta ao contêiner do quiz
    quizContainer.appendChild(perguntaElement);
  });

  // Adiciona um evento de clique para cada opção de resposta
  document.querySelectorAll(".option").forEach(function (option) {
    option.addEventListener("click", function () {
      var pergunta = this.getAttribute("data-pergunta"); // Obtém o número da pergunta
      var opcaoSelecionada = this.getAttribute("data-opcao"); // Obtém o número da opção selecionada
      var respostaCorreta = this.getAttribute("data-resposta"); // Obtém a resposta correta

      // Obtém o elemento de feedback para esta pergunta
      var feedbackDiv = document.getElementById("feedback" + pergunta);

      // Altera a seleção da alternativa
      this.querySelector("input").checked = true;

      // Remove as classes de feedback anteriores
      document.querySelectorAll(".option").forEach(function (opt) {
        opt.classList.remove("correct", "incorrect");
      });

      // Verifica se a resposta selecionada está correta
      if (opcaoSelecionada === respostaCorreta) {
        feedbackDiv.innerHTML =
          "<span class='correct'>&#x2714; Correto!</span>";
        this.classList.add("correct");
      } else {
        feedbackDiv.innerHTML =
          "<span class='incorrect'>&#x2718; Errado! A resposta correta era: " +
          respostaCorreta +
          ") </span>";
        this.classList.add("incorrect");
      }
    });
  });
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

// Função para selecionar aleatoriamente as perguntas do arquivo JSON
function selecionarPerguntas(perguntas, quantidade) {
  // Embaralha as perguntas para garantir variedade na seleção
  var perguntasEmbaralhadas = shuffleArray(perguntas);
  // Seleciona as primeiras "quantidade" perguntas
  return perguntasEmbaralhadas.slice(0, quantidade);
}

// Carrega o arquivo JSON com as perguntas
fetch("data/perguntas.json")
  .then((response) => response.json())
  .then((data) => {
    // Seleciona aleatoriamente as 15 perguntas
    var perguntasSelecionadas = selecionarPerguntas(data, 15);

    // Exibe o quiz com as perguntas selecionadas
    exibirQuiz(perguntasSelecionadas);
  })
  .catch((error) => console.error("Erro ao carregar o arquivo JSON:", error));
