import { fetchGet } from './network';

const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=60.22443802576329&lon=24.757442390056625&units=metric&appid=d6f85495f7c7804d107ab4574e527457`;

/**
 * Fetches current weather
 * @returns {Object} current weather
 */
const getCurrentWeather = async () => {
  try {
    const currentWeatherData = await fetchGet(`${weatherUrl}`);
    console.log(currentWeatherData);
    return currentWeatherData;
  } catch (error) {
    throw new Error(error.message);
  }
};
const WeatherData = {getCurrentWeather};
export default WeatherData;


