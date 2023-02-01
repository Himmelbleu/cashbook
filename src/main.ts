// import vue
import { createApp } from "vue";
import App from "./App.vue";
// import styles
import "uno.css";
import "./style.scss";

// import element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// import global components
import TextIcon from "./tsxs/TextIcon";

const app = createApp(App);

// global components
app.component("TextIcon", TextIcon);

// all element icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.mount("#app");
