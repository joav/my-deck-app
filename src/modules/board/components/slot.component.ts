import { BaseComponent } from "../../base.component";
import { SlotComplete } from "../../shared/slots-to-array";

export class SlotComponent implements BaseComponent {
  constructor(private el: HTMLElement, private parent: HTMLElement, private slot: SlotComplete) { }

  async init() {

  }
}
