import { ref } from "vue";
import $ from "jquery";
var getIP = "https://geolocation-db.com/json/";
var openWeatherMap = "https://api.openweathermap.org/data/2.5/weather/";

export const getweather = () => {
  const city = ref();
  const temp = ref();

  $.getJSON(getIP).done(function (location) {
    $.getJSON(openWeatherMap, {
      lat: location.latitude,
      lon: location.longitude,
      units: "metric",
      APPID: "20fd3e315880d30f3beed6621ed06ee1",
    }).done(function (weather) {
    
      city.value = location.city
      temp.value = Math.round(weather.main.temp);

    });
  });
  return { city, temp };

};
