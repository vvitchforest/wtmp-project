/*let date = new Date();
date.setFullYear(date.getFullYear() - 1);
date = date.toISOString().split('T')[0];
console.log(date);*/

import {fazerProxyUrl} from "../settings";
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

const joinMeals = (parsedMenu, lang) => {
  let coursesArray = [];
  if (parsedMenu.length < 1) {

    if(lang === 'fi') {
      coursesArray.push('Tälle päivälle ei löytynyt aterioita');
    } else {
      coursesArray.push('No meals were found for this day');
    }
  } else {
    parsedMenu.forEach((setMenu) => {
      const meals = setMenu.Meals.map(x => x.Name).join(", ");
      coursesArray.push(meals);
    });
  }
  return coursesArray;
};

const getDailyMenu = async (lang, date) => {

  let dayOfTheWeek = new Date().getDay();

  dayOfTheWeek--;
  if(dayOfTheWeek === -1) {
    dayOfTheWeek = 6;
  }

  let weeklyMenu;
  try {
    weeklyMenu = await fetchGet(`${lang == 'fi' ? weeklyUrlFi:weeklyUrlEn}${date}`);
  } catch (error) {
    throw new Error(error.message);
  }
  const dailyMenu = parseMenu(weeklyMenu, dayOfTheWeek);
  const parsedDailyMeals = joinMeals(dailyMenu, lang);
  return parsedDailyMeals;
};

const FazerData = { getDailyMenu };

export default FazerData;
