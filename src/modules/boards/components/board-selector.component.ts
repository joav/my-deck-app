import { Board } from "../../../models/board";
import { BaseComponent } from "../../base.component";
import { emitEvent } from "../../shared/events-functions";
import { BoardSelectedEvent } from "../models/board-selected-event";
import { BoardsEvent } from "../models/boards-event";

const ITEM_SELECTED = 'boards__list-item-name_selected';

export class BoardSelectorComponent implements BaseComponent {
  constructor(private el: HTMLElement, private parent: HTMLElement, private board?: Board) { }

  async init() {
    this.el.addEventListener('click', e => {
      this.parent.querySelectorAll('li').forEach(el => el.classList.remove(ITEM_SELECTED));
      this.el.classList.add(ITEM_SELECTED);
      emitEvent<BoardSelectedEvent>(BoardsEvent.BOARD_SELECTED, {
        boardId: this.board?.id || this.el.textContent
      });
    });
  }
}
