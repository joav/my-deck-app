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

    this.boardElement.querySelectorAll('.board__item').forEach((e, i) => {
      this.components.push(new SlotComponent((e as HTMLElement), this.boardElement, slots[i]));
    });

    await super.init();
  }

  printSlots(slots: SlotComplete[]) {
    return slots.map(s => `<div class="board__item board__item_${s.state}">
  <div class="board__item-square" ${this.slotBackground(s)}>
    <div class="board__item-content" ${this.slotBackground(s, "image")}>
      ${this.slotContent(s)}
    </div>
    <div class="board__item-actions">
      ${this.slotButtons(s)}
    </div>
  </div>
</div>`)
      .join('');
  }

  slotBackground(slot: Slot, type: "color" | "image" = "color"): string {
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

  slotContent(slot: Slot) {
    return (
      slot.state === "EMPTY"
        ? ""
        : `<span class="board__item-name">${slot.button.name}</span>`
    );
  }

  slotButtons(slot: Slot) {
    return (
      slot.state === "EMPTY"
        ? `<div class="board__item-btn board__item-btn_add">+</div>`
        : `
        <div class="board__item-btn board__item-btn_save">💾</div>
        <div class="board__item-btn board__item-btn_config">⚙</div>
        <div class="board__item-btn board__item-btn_remove">🗑</div>
        `
    );
  }
}
