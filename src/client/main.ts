import { ref } from "vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import VueMultiselect from "vue-multiselect";
import App from "./App.vue";
import router from "./router";
import VueClickAway from "vue3-click-away";
import PrimeVue from 'primevue/config';


const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

app.use(PrimeVue);

app.use(router);
app.use(VueClickAway);

app.component("VueMultiselect", VueMultiselect);




app.directive("visible", function (el, binding) {
  el.style.visibility = !!binding.value ? "visible" : "hidden";
});

app.mount("body");
