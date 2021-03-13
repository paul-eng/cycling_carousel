let gallery = document.getElementsByClassName("gallery")[0];

function galleryInit(galleryObj) {
  nextButton = galleryObj.children[1];
  nextButton.addEventListener("click", nextSlide);

  let images = galleryObj.children[0];
  let slideCount = images.children.length;

  // Insert clone of first slide on end, clone of last slide to front of images object

  let firstSlide = images.children[0].cloneNode(true);
  let lastSlide = images.children[images.children.length - 1].cloneNode(true);
  images.append(firstSlide);
  images.insertBefore(lastSlide, images.children[0]);

  // Programatically set height/width of gallery wrapper object based on size of a slide

  let imgW = firstSlide.offsetWidth;
  let imgH = firstSlide.offsetHeight;
  galleryObj.style.width = `${imgW}px`;
  galleryObj.style.height = `${imgH}px`;

  // Track info about slide position, starting w offset of one slide, to account for the prepended clone

  let slideNumber = 1;
  let imgPosition = -imgW;
  images.style.left = `${imgPosition}px`;

  function advanceSlide(direction) {
    if (direction == "next") {
        slideNumber += 1;
      } else {
        slideNumber -= 1;
      }
      imgPosition = -(slideNumber * imgW);
      images.style.left = `${imgPosition}px`;
  }

  function resetPosition() {
    slideNumber = 1;
    images.style.left = -imgW;
    images.removeEventListener("transitionend",resetPosition);
  }

  function addListener() {
    return new Promise((resolve,reject)=>{
        images.addEventListener("transitionend",resetPosition);
    });
  }

  function nextSlide() {
    if (slideNumber < slideCount) {
      advanceSlide("next");
    } else {
     addListener().then(advanceSlide("next"));
    }
  }
}

galleryInit(gallery);
