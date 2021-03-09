/*let date = new Date();
date.setFullYear(date.getFullYear() - 1);
date = date.toISOString().split('T')[0];
console.log(date);*/

import { fazerProxyUrl } from "../settings";
import { fetchGet } from './network';

const parseMenu = (weeklyMenu, dayOfTheWeek) => {
  let setmenus = [];
  weeklyMenu.LunchMenus[dayOfTheWeek].SetMenus.forEach((setMenu) => {
    setmenus.push(setMenu);
  });
  return setmenus;
};

const parseWeeklyMenu = (weeklyMenu) => {
  console.log(weeklyMenu);
  let setmenus = [];
  let parsedWeeklyMenu = {
    WeekNumber: weeklyMenu.WeekNumber,
    DailyMenus: setmenus
  };

  weeklyMenu.LunchMenus.forEach((lunchMenu) => {
    let coursesArray = [];

    let weekDay = {
      day: lunchMenu.DayOfWeek,
      date: lunchMenu.Date,
      courses: coursesArray,
    };

    lunchMenu.SetMenus.forEach((setMenu) => {
      const meals = setMenu.Meals.map(x => x.Name).join(", ") + ` (${filterDiets(setMenu)})`;
      coursesArray.push(meals);
    });
    setmenus.push(weekDay);
  });
  console.log(parsedWeeklyMenu);
  return parsedWeeklyMenu;
};

const getRestaurantLogo = () => {
  const imageUrl = './assets/images/fazer.png';
  return imageUrl;
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
      commonDiets.push(" " + Diet);
    }
  }
  const finalDiets = commonDiets.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
  return finalDiets;
};

const joinMeals = (parsedMenu) => {
  let coursesArray = [];

  parsedMenu.forEach((setMenu) => {

    const meals = setMenu.Meals.map(x => x.Name).join(", ");
    const course = {
      price: setMenu.Price,
      title: meals,
      diets: filterDiets(setMenu)
    };
    coursesArray.push(course);
  });

  return coursesArray;
};

const getWeeklyMenu = async (restaurantId, lang, date) => {
  date = '2020-02-14';
  try {
    const weeklyMenu = await fetchGet(`${fazerProxyUrl}/api/restaurant/menu/week?language=${lang}&restaurantPageId=${restaurantId}&weekDate=${date}`);
    return parseWeeklyMenu(weeklyMenu);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDailyMenu = async (restaurantId, lang, date) => {

  date = '2020-02-14';

  let dayOfTheWeek = new Date().getDay();

  dayOfTheWeek--;
  if (dayOfTheWeek === -1) {
    dayOfTheWeek = 6;
  }
  dayOfTheWeek = 3;

  let weeklyMenu;
  try {
    weeklyMenu = await fetchGet(`${fazerProxyUrl}/api/restaurant/menu/week?language=${lang}&restaurantPageId=${restaurantId}&weekDate=${date}`);
  } catch (error) {
    throw new Error(error.message);
  }
  const dailyMenu = parseMenu(weeklyMenu, dayOfTheWeek);
  const parsedDailyMeals = joinMeals(dailyMenu);
  return parsedDailyMeals;
};

const FazerData = { getDailyMenu, getRestaurantLogo, getWeeklyMenu };

export default FazerData;
