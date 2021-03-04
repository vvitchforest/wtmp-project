
import SodexoData from './modules/sodexo-data';
import FazerData from './modules/fazer-data';
import Modal from './modules/modal';
import './styles/main.scss';
import HSLData from './modules/hsl-data';
import Announcement from './modules/announcement';

const today = new Date().toISOString().split('T')[0];
console.log(today);

const languageBtn = document.querySelector('#menu-language-btn');
const infoBtn = document.querySelector('#info-btn');
const modeToggle = document.getElementById('checkbox');
const announcementModal = document.getElementById('announcement-modal');
const menuModal = document.getElementById('myModal');

let userSettings = {
  colorTheme: 'light',
  lang: 'fi'
};

const restaurants = [
  {
    title: 'Sodexo Myllypuro',
    name: 'sodexo-myllypuro',
    id: 158,
    type: SodexoData,

  }, {
    title: 'Fazer Karaportti',
    name: 'fazer-kp',
    id: 270540,
    type: FazerData
  },
  {
    title: 'Sodexo Myyrmäki',
    name: 'sodexo-myyrmaki',
    id: 152,
    type: SodexoData
  },
];

/**
 * Updates user settings
 */
const updateUserSettings = () => {
  localStorage.setItem('userConfig', JSON.stringify(userSettings));
};

/**
 * Switches colour theme
 */

const switchTheme = (event) => {
  if (event.target.checked) {
    userSettings.colorTheme = 'dark';
  } else {
    userSettings.colorTheme = 'light';
  }
  document.querySelector('body').setAttribute('data-theme', userSettings.colorTheme);
  updateUserSettings();
};

/**
 * Creates html cards for each restaurant and sets event listeners to modal btn
 * @param {Array} restaurants array of restaurant objects
 */

const createRestaurantCards = (restaurants) => {
  const cardContainer = document.querySelector('.menu-cards-container');
  cardContainer.innerHTML = "";

  for (const restaurant of restaurants) {
    const restaurantCard = document.createElement('article');
    restaurantCard.classList.add('menu-card');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('menu-card-header');

    const cardImgContainer = document.createElement('div');
    cardImgContainer.classList.add('menu-card-img-container');
    const image = document.createElement('img');
    image.src = restaurant.type.getRestaurantLogo();
    image.id = restaurant.name + '-img-id';

    const cardTitle = document.createElement('h3');
    cardTitle.innerHTML = restaurant.title;

    const cardContent = document.createElement('div');
    cardContent.classList.add('menu-card-content');
    cardContent.id = restaurant.name;

    cardImgContainer.appendChild(image);
    cardHeader.appendChild(cardImgContainer);
    cardHeader.appendChild(cardTitle);
    restaurantCard.appendChild(cardHeader);
    restaurantCard.appendChild(cardContent);
    cardContainer.appendChild(restaurantCard);

    Modal.setModalControls(image.id, menuModal.id);

    if (restaurant.type === FazerData) {
      document.getElementById(image.id).addEventListener('click', () => {
        const weeklyMenu = loadWeeklyData(restaurant);
        Modal.renderModalContent(weeklyMenu);
      });
    }
  }
};

/**
 * Fills menu content for each restaurant card
 * @param {Array} menu daily menu of each restaurant
 * @param {Object} restaurant of restaurants array
 */

const fillMenuCard = (menu, restaurant) => {
  const cardContent = document.querySelector(`#${restaurant.name}`);
  cardContent.innerHTML = "";

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  menu.forEach((course) => {
    let listItem = document.createElement('li');
    listItem.innerHTML = course.title + ", " + course.price + ", " + course.diets;
    menuList.appendChild(listItem);
  });
  cardContent.appendChild(menuList);
};

const noDataNotification = (message, restaurant) => {
  const cardContent = document.querySelector('#' + restaurant);
  cardContent.innerHTML += `<p>${message}</p>`;
};


/**
 * Switches language fi/en in Sodexo menu
 */

const switchLanguage = () => {
  if (userSettings.lang === 'fi') {
    userSettings.lang = 'en';
  } else {
    userSettings.lang = 'fi';
  }
  updateUserSettings();
  loadData();
  loadHSLData();
};

const loadWeeklyData = async (restaurant) => {
  let weeklyMenu;
  try {
    weeklyMenu = await FazerData.getWeeklyMenu(restaurant.id, userSettings.lang, today);
  }
  catch (error) {
    console.error(error);
    noDataNotification(`${userSettings.lang == 'fi' ? 'Tälle päivälle ei löytynyt aterioita' : 'No meals were found for this day'}`, restaurant.name);
  }
  return weeklyMenu;
};

const loadData = async () => {
  for (const restaurant of restaurants) {
    try {
      const parsedMenu = await restaurant.type.getDailyMenu(restaurant.id, userSettings.lang, today);
      fillMenuCard(parsedMenu, restaurant);
    }
    catch (error) {
      console.error(error);
      noDataNotification(`${userSettings.lang == 'fi' ? 'Tälle päivälle ei löytynyt aterioita' : 'No meals were found for this day'}`, restaurant.name);
    }
  }
};

const renderHSLData = (stop) => {
  const stopElement = document.createElement('div');
  stopElement.innerHTML = `<h3>Seuraavat vuorot pysäkiltä ${stop.name}</h3><ul>`;
  for (const ride of stop.stoptimesWithoutPatterns) {
    stopElement.innerHTML += `<li>${ride.trip.routeShortName},
      ${ride.trip.tripHeadsign},
      ${HSLData.formatTime(ride.scheduledDeparture)}</li>`;
  }
  stopElement.innerHTML += `</ul>`;
  document.querySelector('.hsl-data-container').appendChild(stopElement);
};

const renderHSLDataLocation = (departures) => {

  document.querySelector('.hsl-data-container').innerHTML = "";
  const departureDiv = document.createElement('div');
  departureDiv.classList.add('hsl-grid');

  const gridTitles = document.createElement('div');
  gridTitles.classList.add('grid-title');
  const titlesArray = ['Linja', 'Pysäkki', 'Etäisyys', 'Päätepysäkki'];
  for (const title of titlesArray) {
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = title;
    gridTitles.appendChild(titleDiv);
  }
  gridTitles.classList.add('grid-titles');
  departureDiv.appendChild(gridTitles);

  const gridTimes = document.createElement('div');
  const gridContent = document.createElement('div');
  gridContent.classList.add('grid-content');
  gridTimes.classList.add('grid-time');
  gridTimes.style.gridTemplateRows = `repeat(${Object.values(departures).length}, 1fr)`;
  gridContent.style.gridTemplateRows = `repeat(${Object.values(departures).length}, 1fr)`;

  for (const departure of departures) {
    const timeDiv = document.createElement('div');
    timeDiv.innerHTML = HSLData.formatTime(departure.node.place.stoptimes[0].scheduledDeparture);
    gridTimes.appendChild(timeDiv);

    gridContent.innerHTML += `<div>${departure.node.place.stoptimes[0].trip.route.shortName}</div>
   <div>${departure.node.place.stop.name}<br>${departure.node.place.stop.code}</div>
   <div>${departure.node.distance}m</div>
   <div>${departure.node.place.stoptimes[0].headsign}</div>`;

  }
  departureDiv.appendChild(gridContent);
  departureDiv.appendChild(gridTimes);

  document.querySelector('.hsl-data-container').appendChild(departureDiv);
};


const loadHSLData = async () => {
  try {
    const result = await HSLData.getDeparturesAndArrivalsByLocation(60.224200671262004, 24.758688330092166, 500);
    console.log(stop);
    //renderHSLData(stop);
    renderHSLDataLocation(result);
  } catch (error) {
    console.error(error);
  }
};

const serviceWorker = () => {

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
};


const init = () => {


  document.querySelector('.mobile-icon-container').addEventListener('click', () => {
    const topNav = document.querySelector('.topnav');
    const navList = document.querySelector('.nav-items');
    const banner = document.querySelector('.banner');
    if (topNav.className === 'topnav') {
      topNav.className += ' mobile';
      navList.className += ' mobile';
      banner.className += ' mobile';

    } else {
      topNav.className = 'topnav';
      navList.className = 'nav-items';
      banner.className = 'banner';
    }
  });


  //Load from local storage if exists or use default user settings
  if (localStorage.getItem('userConfig')) {
    userSettings = JSON.parse(localStorage.getItem("userConfig"));
    document.querySelector('body').setAttribute('data-theme', userSettings.colorTheme);
    if (userSettings.colorTheme === 'dark') {
      modeToggle.checked = true;
    }
  }

  createRestaurantCards(restaurants);
  loadData();
  modeToggle.addEventListener('change', switchTheme, false);
  languageBtn.addEventListener('click', switchLanguage);
  infoBtn.addEventListener('click', Announcement.renderSlides);
  Modal.setModalControls(infoBtn.id, announcementModal.id);
  loadHSLData();

  serviceWorker();
};

init();
