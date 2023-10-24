import { ref } from "vue";
var requestUrl = "https://geolocation-db.com/json/";

const langEn = ref(false) as any;
const langHu = ref(false) as any;

$.ajax({
  url: requestUrl,
  type: "GET",
  success: function (json) {
    if (json.country_name == "Hungary") {
      langHu.value = true;
    } else {
      langEn.value = true;
    }
  },
  error: function (err) {
    console.log("Request failed, error= " + err);
  },
});
