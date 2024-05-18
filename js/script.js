function marcarOpcao(pergunta, opcao) {
  document.querySelector("input[name=" + pergunta + "][value=" + opcao + "]").checked = true;
}

function verificarRespostas() {
    var respostasCorretas = [
      "b", // Resposta correta da pergunta 1
      "a", // Resposta correta da pergunta 2
      "a", // Resposta correta da pergunta 3
      "c", // Resposta correta da pergunta 4
      "b", // Resposta correta da pergunta 5
      "a", // Resposta correta da pergunta 6
      "e", // Resposta correta da pergunta 7
      "c", // Resposta correta da pergunta 8
      "d", // Resposta correta da pergunta 9
      "a", // Resposta correta da pergunta 10
      "c", // Resposta correta da pergunta 11
      "a", // Resposta correta da pergunta 12
      "c", // Resposta correta da pergunta 13
      "a", // Resposta correta da pergunta 14
      "a", // Resposta correta da pergunta 15
      "a", // Resposta correta da pergunta 16
      "b", // Resposta correta da pergunta 17
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
        feedbackDiv.innerHTML = "<span class='incorrect'>&#x2718; Errado! A resposta correta era: " + respostasCorretas[i] + ") </span>";
      }
    }
  
    var respostasDiv = document.getElementById("respostas");
    respostasDiv.style.display = "block";
  }
  
function navBar() {
  let nav = document.querySelector('.nav')
  if (nav.classList.contains('open')) {
    nav.classList.remove('open')
  } else {
    nav.classList.add('open')
  }
}

var swiper = new Swiper(".slide-content", {
  slidesPerView: 3,
  spaceBetween: 25,
  // slidesPerGroup: 3,
  loop: true,
  centerSlide: 'true',
  fade: 'true',
  grabCursor: 'true',
  // loopFillGroupWithBlank: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
  },

  breakpoints:{
      0:{
          slidesPerView: 1,
      },
      670: {
          slidesPerView: 2,
      },
      950: {
          slidesPerView: 3,
      },
  },
});