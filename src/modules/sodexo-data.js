
import { fetchGet } from './network';
const dailyUrl = `https://www.sodexo.fi/ruokalistat/output/daily_json`;
const imageUrl = './assets/images/sodexo.jpg';
const weeklyUrl = `https://www.sodexo.fi/ruokalistat/output/weekly_json`;

/**
 * Parses course arrays from Sodexo menu
 * @param {Object} sodexoMenu
 * @returns {Object} parsed menu arrays
 */
const parseSodexoMenu = (sodexoMenu) => {

  const coursesFi = [];
  const coursesEn = [];

  const courses = Object.values(sodexoMenu);
  courses.forEach((course) => {

    const courseFin = {
      title: course.title_fi,
      diets: course.dietcodes,
      price: course.price
    };

    const courseEn = {
      title: course.title_en,
      diets: course.dietcodes,
      price: course.price
    };

    coursesFi.push(courseFin);
    coursesEn.push(courseEn);
  });

  return { fi: coursesFi, en: coursesEn };
};

const parseSodexoWeeklyMenu = (sodexoWeeklyMenu, lang) => {
  console.log(sodexoWeeklyMenu);
  let setmenus = [];
  const parsedWeeklymenu = {
    WeekNumber: sodexoWeeklyMenu.timeperiod,
    DailyMenus: setmenus
  };

  const mealDates = sodexoWeeklyMenu.mealdates;
  for (const mealdate of mealDates) {
    let coursesArray = [];
    let weekDay = {
      day: mealdate.date,
      date: "",
      courses: coursesArray,
    };
    const courses = Object.values(mealdate.courses);
    console.log(courses);
    for (const course of courses) {
      const mealFi = course.title_fi + " (" + course.dietcodes + ")";
      const mealEn = course.title_en + " (" + course.dietcodes + ")";
      (lang === 'fi' ? coursesArray.push(mealFi) : coursesArray.push(mealEn));
    }
    setmenus.push(weekDay);
  };
  console.log(parsedWeeklymenu);
  return parsedWeeklymenu;
};

const getRestaurantLogo = () => {
  return imageUrl;
};

const getDailyMenu = async (restaurantId, lang, date) => {

  let menuData;
  try {
    menuData = await fetchGet(`${dailyUrl}/${restaurantId}/${date}`);
  } catch (error) {
    throw new Error(error.message);
  }
  const parsedMenu = parseSodexoMenu(menuData.courses);
  return (lang === 'fi') ? parsedMenu.fi : parsedMenu.en;
};

const getWeeklyMenu = async (restaurantId, lang) => {
  let menuData;
  try {
    menuData = await fetchGet(`${weeklyUrl}/${restaurantId}`);
  } catch (error) {
    throw new Error(error.message);
  }
  return parseSodexoWeeklyMenu(menuData, lang);
};

const SodexoData = { getDailyMenu, getWeeklyMenu, getRestaurantLogo };
export default SodexoData;
