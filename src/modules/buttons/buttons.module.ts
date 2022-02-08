import { WithComponentsModule } from "../with-components.module";
import { SliderComponent } from "./components/slider.component";

export class ButtonsModule extends WithComponentsModule {
  private el: HTMLElement;
  constructor() {
    super();
    this.el = document.querySelector('.btns');
  }
  async init() {
    this.components.push(new SliderComponent(this.el.querySelector('.btns__list-container'), this.el));
    super.init();
  }
}
