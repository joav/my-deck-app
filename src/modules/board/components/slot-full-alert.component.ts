import { BaseComponent } from "../../base.component";
import { modalInstance } from "../../modal/modal.module";

export type SlotFullAlertResult = "cancel" | "replace" | "add";

export class SlotFullAlertComponent implements BaseComponent {
  private _result: Promise<SlotFullAlertResult>;
  private form: HTMLElement;

  constructor() {
    this.init();
  }

  async init() {
    this._result = new Promise(r => {
      modalInstance.open({
        title: "Slot ocupado",
        body: this.printForm(),
        maxWidth: "360px",
        hideClose: true,
        disallowScape: true
      });
      this.form = document.querySelector('#slot-full-alert');
      this.form.addEventListener('submit', (e) => this.onSubmit(e, r));
    });
  }

  printForm() {
    return `<form id="slot-full-alert" class="form">
    <p class="form__line">¿Que deberíamos hacer?</p>
    <p class="form__line"><button class="form__submit form__submit-btn_cancel">Cancelar</button></p>
    <p class="form__line"><button class="form__submit form__submit-btn_replace">Reemplazar</button></p>
    <p class="form__line"><button class="form__submit form__submit-btn_add">Añadir pasos a la macro</button></p>
  </form>`;
  }

  onSubmit(e: SubmitEvent, resolve: (value: SlotFullAlertResult | PromiseLike<SlotFullAlertResult>) => void) {
    e.preventDefault();
    let action: SlotFullAlertResult;
    if (e.submitter.classList.length > 1) {
      switch (e.submitter.classList[1]) {
        case "form__submit-btn_replace":
          action = "replace";
          break;
          
        case "form__submit-btn_add":
          action = "add";
          break;
          
        default:
          action = "cancel";
          break;
      }
    }
    resolve(action);
    modalInstance.doClose();
  }

  get result() {
    return this._result;
  }
}
