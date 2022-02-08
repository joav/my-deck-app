import { BaseComponent } from "./base.component";

export abstract class WithComponentsComponent implements BaseComponent {
  components: BaseComponent[] = [];
  async init() {
    for (const component of this.components) {
      component.init();
    }
  }
}
