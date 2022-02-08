import { environment } from "./environment/environment";
import "./scss/styles.scss";
import { initModules } from './modules/index';

window.addEventListener('DOMContentLoaded', (event) => {
  initModules();
});
