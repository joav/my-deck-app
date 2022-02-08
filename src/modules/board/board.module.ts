import { BoardsService } from "../../services/boards.service";
import { BaseModule } from "../base.module";
import { BoardSelectedEvent } from "../boards/models/board-selected-event";
import { BoardsEvent } from "../boards/models/boards-event";
import { emptyBoard } from "../shared/empty-board";
import { emitEvent, onEvent } from "../shared/events-functions";
import { BoardComponent } from "./components/board.component";

export class BoardModule implements BaseModule {
  wrapper: HTMLElement;
  boardComponent: BoardComponent;
  boardTitle: HTMLElement;
  async init() {
    this.wrapper = document.querySelector('.board-wrapper');
    this.boardTitle = this.wrapper.querySelector('.app-grid__item-title');
    this.registerEvents();
    this.boardTitle.addEventListener('focusout', () => this.handleNameChange());
    this.boardTitle.addEventListener('input', (e) => this.checkEnter((e as InputEvent)));
  }
  
  registerEvents() {
    onEvent<BoardSelectedEvent>(BoardsEvent.BOARD_SELECTED, e => this.handleBoardSelected(e.detail));
  }

  async handleBoardSelected(boardSelected: BoardSelectedEvent) {
    let board = emptyBoard();
    try {
      board = await BoardsService.getBoard(boardSelected.boardId);
    } catch (error) { }

    this.boardComponent = new BoardComponent(board);

    this.wrapper.querySelector('.app-grid__item-title').innerHTML = board.name;

    await this.boardComponent.init();
  }

  async handleNameChange() {
    if (this.boardComponent.board.name !== this.boardTitle.textContent) {
      this.boardComponent.board.name = this.boardTitle.textContent;
  
      try {
        await BoardsService.updateBoard(this.boardComponent.board);
  
        emitEvent(BoardsEvent.BOARD_UPDATED);
      } catch (error) { }
    }
  }

  checkEnter(e: InputEvent) {
    if (e.data === null) {
      if (this.wrapper.querySelector('.app-grid__item-title div')) {
        this.wrapper.querySelector('.app-grid__item-title div').remove();
      }
      if (this.wrapper.querySelector('.app-grid__item-title br')) {
        this.wrapper.querySelector('.app-grid__item-title br').remove();
      }
    }
  }
}
