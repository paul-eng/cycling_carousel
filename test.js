let gallery = document.getElementsByClassName("gallery")[0];

function galleryInit(galleryObj) {
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
  images.style.left = `${-imgW}px`;
  let currentlyMoving = false;

  let nextButton = galleryObj.children[1];
  nextButton.addEventListener("click", () => advanceSlide("next"));
  let prevButton = galleryObj.children[2];
  prevButton.addEventListener("click", () => advanceSlide("prev"));
  let overflowButton = document.getElementsByClassName("overflowToggle")[0];
  overflowButton.addEventListener("click", switchOverflow);

  function switchOverflow() {
      gallery.classList.toggle("overflow");
  }

  function updatePosition(direction) {
    direction == "next" ? (slideNumber += 1) : (slideNumber -= 1);
    images.style.left = `-${imgW * slideNumber}px`;
  }

  function resetPosition(pos) {
    images.classList.toggle("noTransition");
    pos == "start" ? (slideNumber = 1) : (slideNumber = slideCount);
    images.style.left = `-${imgW * slideNumber}px`;
    setTimeout(() => images.classList.toggle("noTransition"), 1);
  }

  function followMovement() {
    return new Promise((resolve) => {
      currentlyMoving = true;
      images.addEventListener("transitionend", doneMoving);
      resolve("Success");
    });
  }

  function doneMoving() {
    if (slideNumber > slideCount) {
      resetPosition("start");
    } else if (slideNumber == 0) {
      resetPosition("end");
    }

    images.removeEventListener("transitionend", doneMoving);
    currentlyMoving = false;
  }

  function advanceSlide(direction) {
    //   Without promise to prevent button spamming, any calls to slide the images will resolve before a single transitionend is detected, triggering position reset. Result is images can fly way offscreen before snapping back into place.
    if (currentlyMoving == false) {
      followMovement().then(() => updatePosition(direction));
    }
  }
}

galleryInit(gallery);
