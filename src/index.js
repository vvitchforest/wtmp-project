
import SodexoData from './modules/sodexo-data';
import FazerData from './modules/fazer-data';
import Modal from './modules/modal';
import './styles/main.scss';
import HSLData from './modules/hsl-data';
import Announcement from './modules/announcement';
import Weather from './modules/weather';
import Corona from './modules/corona';

let today = new Date().toISOString().split('T')[0];
console.log(today);

const languageBtn = document.querySelector('#menu-language-btn');
const infoBtn = document.querySelector('#info-btn');
const addRestaurantBtn = document.querySelector('#add-restaurant-btn');
const modeToggle = document.getElementById('checkbox');
const announcementModal = document.getElementById('announcement-modal');
const weeklyMenuModal = document.getElementById('myModal');

const weatherDiv = document.getElementById('weather');
const coronaDiv = document.getElementById('corona-data');

const loadWeatherData = async () => {
  try {
    const weatherData = await Weather.getCurrentWeather();
    renderCurrentWeather(weatherData);
  }
  catch (error) {
    console.error(error);
  }
};

const loadCoronaData = async () => {
  try {
    const coronaData = await Corona.getCoronaInfo();
    renderCoronaData(coronaData);
  }
  catch (error) {
    console.error(error);
  }
};

const renderCoronaData = (coronaData) => {
  const casesThisWeek = document.createElement('span');
  const totalCasesUusimaa = document.createElement('span');

  coronaDiv.appendChild(casesThisWeek);
  coronaDiv.appendChild(totalCasesUusimaa);

};

const renderCurrentWeather = (weatherData) => {
  const weatherImg = document.createElement('img');
  weatherImg.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;

  const weatherDesc = document.createElement('p');
  weatherDesc.innerHTML = `${weatherData.weather[0].main}`;

  const weatherTemp = document.createElement('span');
  weatherTemp.innerHTML = `${weatherData.main.temp} °C`;

  weatherDiv.appendChild(weatherImg);
  weatherDiv.appendChild(weatherDesc);
  weatherDiv.appendChild(weatherTemp);
};

let selectedRestaurants = [
  {
    title: 'Fazer Karaportti',
    name: 'fazer-kp',
    id: 270540,
    type: FazerData
  },
];

let unselectedRestaurants = [
  {
    title: 'Sodexo Myyrmäki',
    name: 'sodexo-myyrmaki',
    id: 152,
    type: SodexoData
  },
  {
    title: 'Sodexo Myllypuro',
    name: 'sodexo-myllypuro',
    id: 158,
    type: SodexoData,

  },
];

let userSettings = {
  colorTheme: 'light',
  lang: 'fi',
  restaurants: []
};

const createRestaurantOptions = (unselected) => {
  const restaurantsSelect = document.querySelector('#restaurants-select');
  restaurantsSelect.innerHTML = "";
  for (const unselectedRestaurant of unselected) {
    const option = document.createElement('option');
    option.value = unselectedRestaurant.name;
    option.innerHTML = unselectedRestaurant.title;
    restaurantsSelect.appendChild(option);
  }
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

    Modal.setModalControls(image.id, weeklyMenuModal.id);

    if (restaurant.type === FazerData) {
      document.getElementById(image.id).addEventListener('click', () => {
        const weeklyMenu = loadWeeklyData(restaurant);
        Modal.renderModalContent(weeklyMenu);
      });
    }
  }
};

const addingRestaurants = () => {
  if (unselectedRestaurants.length > 0) {
    const restaurantOptions = document.querySelector('#restaurants-select');
    const selectedRestaurant = unselectedRestaurants.splice(unselectedRestaurants.findIndex(a => a.name === restaurantOptions.value), 1);

    const addedRestaurant = {
      title: selectedRestaurant[0].title,
      name: selectedRestaurant[0].name,
      id: selectedRestaurant[0].id,
      type: selectedRestaurant[0].type
    };
    selectedRestaurants.push(addedRestaurant);

    createRestaurantCards(selectedRestaurants);
    createRestaurantOptions(unselectedRestaurants);
    loadData();
    updateUserSettings();
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
  loadData();
  loadHSLData();
  updateUserSettings();
};

const loadWeeklyData = async (restaurant) => {
  try {
    const weeklyMenu = await FazerData.getWeeklyMenu(restaurant.id, userSettings.lang, today);
    console.log(weeklyMenu);
    return weeklyMenu;
  }
  catch (error) {
    console.error(error);
    noDataNotification(`${userSettings.lang == 'fi' ? 'Tälle päivälle ei löytynyt aterioita' : 'No meals were found for this day'}`, restaurant.name);
  }

};

const loadData = async () => {
  for (const restaurant of selectedRestaurants) {
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
  gridTimes.style.gridTemplateRows = `repeat(${departures}, 1fr)`;
  gridContent.style.gridTemplateRows = `repeat(${departures}, 1fr)`;

  for (const departureObj of departures) {
    const timeDiv = document.createElement('div');
    timeDiv.innerHTML = HSLData.formatTime(departureObj.realtimeArrival);
    gridTimes.appendChild(timeDiv);

    gridContent.innerHTML += `<div>${departureObj.routeShortName}</div>
   <div>${departureObj.name}<br>${departureObj.code}</div>
   <div>${departureObj.distance}m</div>
   <div>${departureObj.headsign}</div>`;
  }

  departureDiv.appendChild(gridContent);
  departureDiv.appendChild(gridTimes);

  document.querySelector('.hsl-data-container').appendChild(departureDiv);
};


const loadHSLData = async () => {
  try {
    const result = await HSLData.getDeparturesAndArrivalsByLocation(60.224200671262004, 24.758688330092166);
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

const getUserRestaurants = (userSettings) => {
  for (const restaurant of userSettings.restaurants) {
    if (restaurant.type === "FazerData") {
      restaurant.type = FazerData;
    } else if ( restaurant.type === "SodexoData"){
      restaurant.type = SodexoData;
    }
  }
  return userSettings.restaurants;
};

/**
 * Updates user settings
 */
 const updateUserSettings = () => {
  const userRestaurants = [];
  for(const addedRestaurant of selectedRestaurants) {
    const addition = {
      title: addedRestaurant.title,
      name: addedRestaurant.name,
      id: addedRestaurant.id,
      type: (addedRestaurant.type === FazerData ? "FazerData" : "SodexoData")
    };
    userRestaurants.push(addition);
  }
  userSettings.restaurants = userRestaurants;
  localStorage.setItem('userConfig', JSON.stringify(userSettings));
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

    if (userSettings.restaurants.length > 0) {
      selectedRestaurants = getUserRestaurants(userSettings);
      unselectedRestaurants = unselectedRestaurants.filter( (unselected) =>!selectedRestaurants.find( (selected) => ( selected.name === unselected.name) ));
    }

    document.querySelector('body').setAttribute('data-theme', userSettings.colorTheme);
    if (userSettings.colorTheme === 'dark') {
      modeToggle.checked = true;
    }
  }

  createRestaurantCards(selectedRestaurants);
  createRestaurantOptions(unselectedRestaurants);
  loadData();
  modeToggle.addEventListener('change', switchTheme, false);
  languageBtn.addEventListener('click', switchLanguage);
  addRestaurantBtn.addEventListener('click', addingRestaurants);
  infoBtn.addEventListener('click', Announcement.renderSlides);
  Modal.setModalControls(infoBtn.id, announcementModal.id);
  loadHSLData();
  /*loadWeatherData();
  loadCoronaData();*/

  //serviceWorker();
};

init();
