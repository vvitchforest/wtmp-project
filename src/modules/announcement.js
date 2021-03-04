import announcementData from '../assets/announcement-data.json';

const renderSlides = () => {
  const modalContent = document.querySelector('.announcement-modal-content');
  modalContent.innerHTML = "";
  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('info-slides');
  for (const slide of announcementData) {
    const slideImg = document.createElement('img');
    slideImg.src = slide.image;
    //console.log(slide.image);
    slidesContainer.appendChild(slideImg);
  };
  modalContent.appendChild(slidesContainer);
};



const Announcement = {renderSlides};
export default Announcement;
