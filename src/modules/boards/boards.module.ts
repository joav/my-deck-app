import { Board } from "../../models/board";
import { BoardsService } from "../../services/boards.service";
import { emitEvent, onEvent } from "../shared/events-functions";
import { WithComponentsModule } from "../with-components.module";
import { BoardSelectorComponent } from "./components/board-selector.component";
import { CreateBoardComponent } from "./components/create-board.component";
import { BoardAddedEvent } from "./models/board-added-event";
import { BoardSelectedEvent } from "./models/board-selected-event";
import { BoardsEvent } from "./models/boards-event";

export class BoardsModule extends WithComponentsModule {
  private list: HTMLElement;
  private addButton: HTMLButtonElement;
  private currentSelected: string;
  constructor() {
    super();
    this.list = document.querySelector('.boards__list');
    this.addButton = document.querySelector('.boards__add');
  }

  async init() {
    this.registerEvents();
    this.addButton.addEventListener('click', () => this.openCreateDialog());
    this.updateBoards();
  }

  registerEvents() {
    onEvent<BoardSelectedEvent>(BoardsEvent.BOARD_SELECTED, e => this.currentSelected = e.detail.boardId);
    onEvent<BoardAddedEvent>(BoardsEvent.BOARD_ADDED, async e => {
      this.updateBoards();
      emitEvent<BoardSelectedEvent>(BoardsEvent.BOARD_SELECTED, {boardId: e.detail.boardId});
    });
    onEvent(BoardsEvent.BOARD_UPDATED, e => this.updateBoards());
  }

  async updateBoards() {
    await this.getBoards();
    await super.init();
  }

  async getBoards() {
    this.components = [];
    const boards = await BoardsService.getBoards();
    this.list.innerHTML = this.printBoards(boards);
    this.list.querySelectorAll('li').forEach((el, i) => this.components.push(new BoardSelectorComponent(el, this.list, boards[i])));
    if (!this.currentSelected) this.currentSelected = boards[0].id;
    emitEvent<BoardSelectedEvent>(BoardsEvent.BOARD_SELECTED, { boardId: this.currentSelected});
  }

  printBoards(boards: Board[]) {
    return boards.map((b, i) => `<li class="boards__list-item${(!this.currentSelected && i === 0) || b.id === this.currentSelected?' boards__list-item-name_selected':''}"><span class="boards__list-item-name">${b.name}</span></li>`)
      .join('');
  }

  async openCreateDialog() {
    new CreateBoardComponent(this.components.length);
  }
}
