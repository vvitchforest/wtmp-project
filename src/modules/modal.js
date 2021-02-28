/*const modal = document.getElementById('modal-1');
const openModalImgBtn = document.querySelector('#card1 .card-img-container');
const closeModalBtn = document.getElementsByClassName('close')[0];

const modalOpen = () => {
  modal.style.display = 'block';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${window.scrollY}px`;
};

const modalClose = () => {
  modal.style.display = 'none';
  document.body.style.position = '';
  document.body.style.top = '';
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.top = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
};

openModalImgBtn.addEventListener('click', modalOpen);
  closeModalBtn.addEventListener('click', modalClose);
  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modalClose();
    }
  });*/





  const renderModalContent = async (fetchResult) => {
    const weeklyMenu = await fetchResult;
    console.log(weeklyMenu);
    const modal = document.getElementById('myModal');
    const modalContent = document.querySelector('.modal-content');
    const modalParagraph = document.createElement('p');
    modalParagraph.innerHTML += `<h3>Viikko ${weeklyMenu.WeekNumber}</h3><br>`;

    for(const day of weeklyMenu.DailyMenus) {
      modalParagraph.innerHTML += `<br>${day.day} ${day.date}<br><br>`;
      for(const course of day.courses) {
        modalParagraph.innerHTML += `${course}<br>`;
      }
      modalParagraph.innerHTML += `<br>`;
    }
    modalContent.innerHTML = "";
    modalContent.appendChild(modalParagraph);
    modal.appendChild(modalContent);

  };

  const setModalControls = (triggerId, modalId) => {
    // Get the modal
    const modal = document.getElementById(modalId);
    // Get the button that opens the modal
    const btn = document.getElementById(triggerId);
    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];
    // When the user clicks on the button, open the modal
    btn.addEventListener('click', () => {
      modal.style.display = "block";
    });
    // When the user clicks on <span> (x), close the modal
    span.addEventListener('click', () => {
      modal.style.display = "none";
    });
    // When the user clicks anywhere outside of the modal, close it
    document.addEventListener('click', (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  };


  const Modal = {setModalControls, renderModalContent};
  export default Modal;
