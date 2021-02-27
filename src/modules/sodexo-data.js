
import { fetchGet } from './network';
const dailyUrl = `https://www.sodexo.fi/ruokalistat/output/daily_json`;
const imageUrl = './assets/images/sodexo.jpg';

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

const SodexoData = { getDailyMenu, getRestaurantLogo };
export default SodexoData;
