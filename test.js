let gallery = document.getElementsByClassName("gallery")[0];

function galleryInit(galleryObj) {
  nextButton = galleryObj.children[1];
  nextButton.addEventListener("click", nextSlide);

  // Note slideCount is established before cloning any nodes
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

  // Track info about slide position, initialize w offset of one slide, to account for the prepended clone

  let slideNumber = 1;
  let pixelOffset = -imgW;
  images.style.left = `${pixelOffset}px`;
  let currentlyMoving = false;

  function updatePosition() {
    slideNumber += 1;
    pixelOffset = -(imgW * slideNumber);
    images.style.left = `${pixelOffset}px`;
  }

  function resetPosition() {
    images.classList.toggle("noTransition");
    slideNumber = 1;
    images.style.left = `-${imgW}px`;
    setTimeout(()=>images.classList.toggle("noTransition"),1);
  }

  function startMoving() {
    return new Promise((resolve) => {
      currentlyMoving = true;
      images.addEventListener("transitionend", doneMoving);
      resolve("Success");
    });
  }

  
  function doneMoving() {
    if (slideNumber > slideCount ) {
        resetPosition();
    } 

    images.removeEventListener("transitionend", doneMoving);
    currentlyMoving = false;
  }

  function nextSlide() {
    //   Without promise to prevent button spamming, any calls to slide the images will resolve before a single transitionend is detected, triggering position reset. Result is images can fly way offscreen before snapping back into place.
    if (currentlyMoving == false) {
      startMoving().then(updatePosition);
    }
  }
}

galleryInit(gallery);
