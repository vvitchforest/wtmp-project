
import { fetchGet } from './network';
const dailyUrl = `https://www.sodexo.fi/ruokalistat/output/daily_json/152/`;

/**
 * Parses course arrays from Sodexo menu
 * @param {Object} sodexoMenu
 * @returns {Object} parsed menu arrays
 */
const parseSodexoMenu = (sodexoMenu) => {
  const coursesFi = [];
  const coursesEn = [];

  if (sodexoMenu == null) {
    coursesFi.push('Tälle päivälle ei löytynyt aterioita');
    coursesEn.push('No meals were found for this day');
  } else {
    const courses = Object.values(sodexoMenu);
    courses.forEach((course) => {
      coursesFi.push(course.title_fi);
      coursesEn.push(course.title_en);
    });
  }
  return { fi: coursesFi, en: coursesEn };
};

const getMenu = async(lang, date) => {
  let menuData;
  try {
    menuData = await fetchGet(`${dailyUrl}${date}`);
  } catch (error) {
    throw new Error(error.message);
  }
  const parsedMenu = parseSodexoMenu(menuData.courses);
  return (lang === 'fi') ? parsedMenu.fi : parsedMenu.en;
};

const SodexoData = {getMenu};
export default SodexoData;
