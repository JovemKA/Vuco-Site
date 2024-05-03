function verificarRespostas() {
    var respostasCorretas = [
      "a", // Resposta correta da pergunta 1
      "a", // Resposta correta da pergunta 2
      "a", // Resposta correta da pergunta 3
      "a", // Resposta correta da pergunta 4
      "a", // Resposta correta da pergunta 5
      "a", // Resposta correta da pergunta 6
      "a", // Resposta correta da pergunta 7
      "a", // Resposta correta da pergunta 8
      "a", // Resposta correta da pergunta 9
      "a", // Resposta correta da pergunta 10
      "a", // Resposta correta da pergunta 11
      "a", // Resposta correta da pergunta 12
      "a", // Resposta correta da pergunta 13
      "a", // Resposta correta da pergunta 14
      "a", // Resposta correta da pergunta 15
      "a", // Resposta correta da pergunta 16
      "a", // Resposta correta da pergunta 17
      // Insira o resto das respostas corretas aqui
    ];
  
    var pontuacao = 0;
    var formulario = document.getElementById("quizForm");
  
    for (var i = 0; i < respostasCorretas.length; i++) {
      var respostaSelecionada = formulario.elements["q" + (i + 1)].value;
      var feedbackDiv = document.getElementById("feedback" + (i + 1));
      if (respostaSelecionada === respostasCorretas[i]) {
        feedbackDiv.innerHTML = "<span class='correct'>&#x2714; Correto!</span>";
        pontuacao++;
      } else {
        feedbackDiv.innerHTML = "<span class='incorrect'>&#x2718; Errado! A resposta correta era: " + respostasCorretas[i] + "</span>";
      }
    }
  
    var respostasDiv = document.getElementById("respostas");
    respostasDiv.style.display = "block";
  }
  