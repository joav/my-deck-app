import { Button } from "../../../models/button";
import { ButtonsService } from "../../../services/buttons.service";
import { BaseComponent } from "../../base.component";
import { emitEvent } from "../../shared/events-functions";
import { ButtonsEvent } from "../models/buttons-event";

export class ButtonComponent implements BaseComponent {
  constructor(private el: HTMLElement, private parent: HTMLElement, private button: Button) { }

  async init() {
    this.el.draggable = true;
    this.registerEvents();
  }

  registerEvents() {
    this.el.addEventListener('dragstart', e => this.handleDrag(e));
    this.el.querySelector('.btns__item-action').addEventListener('click', () => this.handleRemove());
  }

  handleDrag(e: DragEvent) {
    e.dataTransfer.setData("button", JSON.stringify({...this.button, id: null}));
  }

  async handleRemove() {
    await ButtonsService.deleteButton(this.button.id);
    emitEvent(ButtonsEvent.BUTTON_REMOVED);
  }
}
