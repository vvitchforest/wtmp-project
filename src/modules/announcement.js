import announcementData from '../assets/announcement-data.json';
let slideIndex = 1;



const renderSlides = () => {
  const modalSlidesContainer = document.querySelector('#announcement-slides-container');
  modalSlidesContainer.innerHTML = "";

  const previousSlide = document.createElement('a');
  previousSlide.classList.add('previous');
  previousSlide.innerHTML = "&#10094;";
  const nextSlide = document.createElement('a');
  nextSlide.classList.add('next');
  nextSlide.innerHTML = "&#10095;";

  for (const slide of announcementData) {
    const mySlide = document.createElement('div');
    mySlide.classList.add('my-slides');
    const slideImg = document.createElement('img');
    slideImg.src = slide.image;
    slideImg.alt = slide.name;
    const slideN = document.createElement('span');
    slideN.innerHTML = slide.id;
    slideN.classList.add('slide-number');
    const slideNumberContainer = document.createElement('div');
    slideNumberContainer.classList.add('slide-number-container');
    slideNumberContainer.appendChild(slideN);
    mySlide.appendChild(slideNumberContainer);
    mySlide.appendChild(slideImg);
    modalSlidesContainer.appendChild(mySlide);
  };
  nextSlide.addEventListener('click', () => {
    plusSlides(1);
  });
  previousSlide.addEventListener('click', () => {
    plusSlides(-1);
  });

  modalSlidesContainer.appendChild(previousSlide);
  modalSlidesContainer.appendChild(nextSlide);
  showSlides(slideIndex);
};


const plusSlides = (n) => {
  showSlides(slideIndex += n);
};

function currentSlide(n) {
  showSlides(slideIndex = n);
}



function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName("my-slides");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";

};

const Announcement = { renderSlides };
export default Announcement;
