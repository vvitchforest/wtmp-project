const modal = document.getElementById('modal-1');
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
  });
