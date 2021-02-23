/*let date = new Date();
date.setFullYear(date.getFullYear() - 1);
date = date.toISOString().split('T')[0];
console.log(date);*/

import { fazerProxyUrl } from "../settings";
import { fetchGet } from './network';

const weeklyUrlFi = `${fazerProxyUrl}/api/restaurant/menu/week?language=fi&restaurantPageId=270540&weekDate=`;
const weeklyUrlEn = `${fazerProxyUrl}/api/restaurant/menu/week?language=en&restaurantPageId=270540&weekDate=`;

const parseMenu = (weeklyMenu, dayOfTheWeek) => {
  let meals = [];
  if (weeklyMenu.LunchMenus != null && weeklyMenu.LunchMenus.length > 0) {
    console.log(weeklyMenu);
    weeklyMenu.LunchMenus[dayOfTheWeek].SetMenus.forEach((setMenu) => {
      meals.push(setMenu);
    });
  }
  return meals;
};

const filterDiets = (setMenu) => {
  let tbaDiets = [], commonDiets = [];

  for (const meal of setMenu.Meals) {
    for (const diet of meal.Diets) {
      tbaDiets.push(diet);
    }
  }

  const count = (array, search) => array.reduce((n, x) => n + (x === search), 0);
  for (const Diet of tbaDiets) {
    if (count(tbaDiets, Diet) === Object.values(setMenu.Meals).length) {
      commonDiets.push(Diet);
    }
  }

  const finalDiets = commonDiets.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
  return finalDiets;
};

const joinMeals = (parsedMenu, lang) => {
  let coursesArray = [];
  if (parsedMenu.length < 1) {

    if (lang === 'fi') {
      coursesArray.push('Tälle päivälle ei löytynyt aterioita');
    } else {
      coursesArray.push('No meals were found for this day');
    }
  } else {
    parsedMenu.forEach((setMenu) => {

      const meals = setMenu.Meals.map(x => x.Name).join(", ");
      const course = {
        price: setMenu.Price,
        title: meals,
        diets: filterDiets(setMenu)
      };
      coursesArray.push(course);
    });
  }
  return coursesArray;
};

const getDailyMenu = async (lang, date) => {

  let dayOfTheWeek = new Date().getDay();

  dayOfTheWeek--;
  if (dayOfTheWeek === -1) {
    dayOfTheWeek = 6;
  }

  let weeklyMenu;
  try {
    weeklyMenu = await fetchGet(`${lang == 'fi' ? weeklyUrlFi : weeklyUrlEn}${date}`);
  } catch (error) {
    throw new Error(error.message);
  }
  const dailyMenu = parseMenu(weeklyMenu, dayOfTheWeek);
  const parsedDailyMeals = joinMeals(dailyMenu, lang);
  return parsedDailyMeals;
};

const FazerData = { getDailyMenu };

export default FazerData;
