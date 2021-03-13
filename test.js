slides = document.getElementsByClassName("images")[0];

nextButton = document.getElementsByClassName("next")[0];
nextButton.addEventListener("click", nextSlide);

let firstSlide = slides.children[0].cloneNode(true);
let lastSlide = slides.children[slides.children.length - 1].cloneNode(true);
slides.append(firstSlide);
slides.insertBefore(lastSlide, slides.children[0]);

function nextSlide() {

}
