import { ref } from "vue";
import $ from "jquery";
import axios from "axios";

var getIP = "https://ipinfo.io/json";
var openWeatherMap = "https://api.openweathermap.org/data/2.5/weather/";

export const getweather = () => {
  const city = ref();
  const temp = ref();
  const latitude = ref();
  const longitude = ref();

  axios
    .get(getIP)
    .then((res) => {
      const data = res.data;
      const [reslatitude, reslongitude] = data.loc.split(",");
      var lat = parseFloat(reslatitude);
      var lon = parseFloat(reslongitude);

      latitude.value = lat;
      longitude.value = lon;
      city.value = data.city;
    })
    .then(() => {
      $.getJSON(openWeatherMap, {
        lat: latitude.value,
        lon: longitude.value,
        units: "metric",
        APPID: "20fd3e315880d30f3beed6621ed06ee1",
      }).done(function (weather) {
        console.log(weather);
        city.value = city.value;
        temp.value = Math.round(weather.main.temp);
      });
    });

  return { city, temp };
};
