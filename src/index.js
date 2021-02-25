
import SodexoData from './modules/sodexo-data';
import FazerData from './modules/fazer-data';
import './styles/main.scss';
import HSLData from './modules/hsl-data';


const today = new Date().toISOString().split('T')[0];
console.log(today);

//let languageSetting = 'fi';


const languageBtn = document.querySelector('#menu-language-btn');
const modeToggle = document.getElementById('checkbox');

let userSettings = {
  colorTheme: 'light',
  lang: 'fi'
};

const restaurants = [
  {
    title: 'Sodexo Myllypuro',
    name: 'sodexo-myllypuro',
    id: 158,
    type: SodexoData
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
  }];


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
 * Creates lunch menu list items into menu list
 * @param {Array} menu lunch menu array
 */

const createRestaurantCards = (restaurants) => {
  const cardContainer = document.querySelector('.menu-cards-container');
  cardContainer.innerHTML = "";
  for (const restaurant of restaurants) {
    const restaurantCard = document.createElement('article');
    restaurantCard.classList.add('menu-card');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('menu-card-header');

    const cardContent = document.createElement('div');
    cardContent.classList.add('menu-card-content');
    cardContent.id = restaurant.name;

    restaurantCard.appendChild(cardHeader);
    restaurantCard.appendChild(cardContent);
    cardContainer.appendChild(restaurantCard);
  }
};


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
  cardContent.innerHTML = `<p>${message}</p>`;
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


const loadHSLData = async () => {
  try {
    const result = await HSLData.getDeparturesAndArrivalsByStopId(2132207);
    const stop = result.data.stop;
    renderHSLData(stop);
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
  loadHSLData();

  //serviceWorker();
};

init();
