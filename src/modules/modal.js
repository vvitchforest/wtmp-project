/**
 * Renders modal content for weekly menu
 * @param {Object} fetchResult parsed weekly menu
 */
const renderModalContent = async (fetchResult) => {
  const weeklyMenu = await fetchResult;
  console.log(weeklyMenu);
  const modal = document.querySelector('.modal-content');
  const weeklyMenuContainer = document.querySelector('#weekly-menu-container');
  const modalParagraph = document.createElement('p');
  modalParagraph.innerHTML += `<h3> Viikko ${weeklyMenu.WeekNumber}</h3><br>`;

  for (const day of weeklyMenu.DailyMenus) {
    modalParagraph.innerHTML += `<br>${day.day} ${day.date}<br><br>`;
    for (const course of day.courses) {
      modalParagraph.innerHTML += `${course}<br>`;
    }
    modalParagraph.innerHTML += `<br>`;
  }
  weeklyMenuContainer.innerHTML = "";
  weeklyMenuContainer.appendChild(modalParagraph);
  modal.appendChild(weeklyMenuContainer);
};
/**
 * Sets modal coontrols
 * @param {String} triggerId
 * @param {String} modalId
 */
const setModalControls = (triggerId, modalId) => {
  const modal = document.getElementById(modalId);
  const btn = document.getElementById(triggerId);
  const span = document.getElementById(modalId + "-close");
  btn.addEventListener('click', () => {
    modal.style.display = "flex";
    modal.style.alignItems = "center";
  });
  span.addEventListener('click', () => {
    modal.style.display = "none";
  });
  document.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
};

const Modal = { setModalControls, renderModalContent };
export default Modal;
