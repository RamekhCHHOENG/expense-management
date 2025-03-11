import { defineNuxtPlugin } from "#app";
import {
    VisArea,
    VisDonut,
    VisSingleContainer,
    VisStackedBar,
    VisXYContainer,
} from "@unovis/vue";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("VisXYContainer", VisXYContainer);
    nuxtApp.vueApp.component("VisSingleContainer", VisSingleContainer);
    nuxtApp.vueApp.component("VisArea", VisArea);
    nuxtApp.vueApp.component("VisStackedBar", VisStackedBar);
    nuxtApp.vueApp.component("VisDonut", VisDonut);
});
