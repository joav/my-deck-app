import { Board, Slot } from "../../../models/board";
import { SlotComplete, slotsToArray } from "../../shared/slots-to-array";
import { WithComponentsComponent } from "../../with-components.component";
import { SlotComponent } from "./slot.component";

export class BoardComponent extends WithComponentsComponent {
  boardElement: HTMLElement;
  constructor(public board: Board) {
    super();
    this.boardElement = document.querySelector('.board');
  }

  async init() {
    const slots = slotsToArray(this.board);

    this.boardElement.querySelector('.board__container-wrapper').innerHTML = this.printSlots(slots);

    this.boardElement.querySelectorAll('.board__item').forEach((e, i) => this.components.push(new SlotComponent((e as HTMLElement), this.boardElement, slots[i])));

    await super.init();
  }

  printSlots(slots: SlotComplete[]) {
    return slots.map(s => `<div class="board__item">
  <div class="board__item-square" ${this.slotBackground(s)}>
    <div class="board__item-content" ${this.slotBackground(s, "image")}></div>
  </div>
</div>`)
      .join('');
  }

  slotBackground(slot: Slot, type: "color" | "image" = "color"): string {
    if (slot.state === "EMPTY")
    return (
      slot.state === "EMPTY"
      ? ""
      : (
        type === "color"
        ? `style="background-color: ${slot.button.color};"`
        : `style="background-image: url('${slot.button.icon}');"`
      )
    );
  }
}
