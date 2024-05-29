function navBar() {
  let nav = document.querySelector('.nav');
  if (nav.classList.contains('open')) {
    nav.classList.remove('open');
  } else {
    nav.classList.add('open');
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
  breakpoints: {
    0: {
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

function showBar() {
  let nav = document.querySelector(".nav");
  let close = document.querySelector(".close_btn")

  nav.classList.add("open");
  console.log(nav.classList)
  close.style.display = 'flex'
  close.style.width = '50px'
  close.style.height = '50px'
  close.style.color = "black"

}

function closeBar() {
  let nav = document.querySelector(".nav");
  let close = document.querySelector(".close_btn")
  nav.classList.remove("open");
  close.style.display = 'none'
}