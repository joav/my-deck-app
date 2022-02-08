import { BaseComponent } from "./base.component";
import { BaseModule } from "./base.module";

export abstract class WithComponentsModule implements BaseModule {
  components: BaseComponent[] = [];
  async init() {
    for (const component of this.components) {
      component.init();
    }
  }
}
