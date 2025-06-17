// weather.ts
import axios from 'axios';

const API_KEY = '20fd3e315880d30f3beed6621ed06ee1';

export async function getWeatherInfo() {
  try {
    // Get user location by IP
    const ipResponse = await axios.get('https://ipinfo.io/json');
    const [lat, lon] = ipResponse.data.loc.split(',');

    // Get weather data
    const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: lat,
        lon: lon,
        units: 'metric',
        appid: API_KEY
      }
    });

    const weatherData = weatherResponse.data;
    return {
      city: weatherData.name,
      temp: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon
    };
  } catch (error) {
    console.error('Error fetching weather info:', error);
    return null;
  }
}
