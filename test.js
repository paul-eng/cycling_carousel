let gallery = document.getElementsByClassName("gallery")[0];

function galleryInit(galleryObj) {

  class Slide {
    constructor(count, active) {
      this.count = count;
      this._active = active;
    }
  
    set active(value) {
      this._active = value;
      setOpacity();
      return value;
    }
  
    get active() {
      return this._active;
    }
  }
  // Note slide.count is established before cloning any nodes
  let images = galleryObj.children[0];
  let slide = new Slide(images.children.length, 1);

  // Insert clone of first slide on end, clone of last slide to front of images object

  let firstSlide = images.children[0].cloneNode(true);
  let lastSlide = images.children[images.children.length - 1].cloneNode(true);
  images.append(firstSlide);
  images.insertBefore(lastSlide, images.children[0]);

  // Programatically set height/width of gallery wrapper object based on size of a slide

  let wrapper = document.getElementsByClassName("gallery")[0].parentElement;

  let imgW = firstSlide.offsetWidth;
  let imgH = firstSlide.offsetHeight;
  wrapper.style.width = `${imgW}px`;
  wrapper.style.height = `${imgH}px`;

  // Track info about slide position, initialize w offset of one slide, to account for the prepended clone

  images.style.left = `${-imgW}px`;
  let currentlyMoving = false;

  let controls = document.getElementsByClassName("controls")[0];

  let nextButton = controls.children[0];
  nextButton.addEventListener("click", () => advanceSlide("next"));
  let prevButton = controls.children[2];
  prevButton.addEventListener("click", () => advanceSlide("prev"));
  let overflowButton = controls.children[1];
  overflowButton.addEventListener("click", switchOverflow);

  let slides = Array.from(images.children);
  setOpacity();

  function setOpacity() {
    let galleryClasses = Array.from(galleryObj.classList);
    slides.forEach((img, idx) => {
      galleryClasses.includes("overflow")
        ? (img.style.opacity = "100%")
        : idx == slide.active
        ? (img.style.opacity = "100%")
        : (img.style.opacity = "60%");
    });
  }

  function switchOverflow() {
    gallery.classList.toggle("overflow");
    setOpacity();
  }

  function updatePosition(direction) {
    direction == "next" ? (slide.active += 1) : (slide.active -= 1);
    images.style.left = `-${imgW * slide.active}px`;
  }

  function resetPosition(pos) {
    images.classList.toggle("noTransition");
    pos == "start" ? (slide.active = 1) : (slide.active = slide.count);
    images.style.left = `-${imgW * slide.active}px`;
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
    if (slide.active > slide.count) {
      resetPosition("start");
    } else if (slide.active == 0) {
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
