import { BoardsService } from "../../services/boards.service";
import { BaseModule } from "../base.module";
import { BoardSelectedEvent } from "../boards/models/board-selected-event";
import { BoardsEvent } from "../boards/models/boards-event";
import { emptyBoard } from "../shared/empty-board";
import { emitEvent, onEvent } from "../shared/events-functions";
import { SlotComplete } from "../shared/slots-to-array";
import { BoardComponent } from "./components/board.component";
import { BoardEvent } from "./models/board-event";
import { SlotMovedEvent } from "./models/slot-moved-event";

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
    onEvent<SlotComplete>(BoardEvent.SLOT_SETTED, e => this.handleSlotSetted(e.detail));
    onEvent<SlotMovedEvent>(BoardEvent.SLOT_MOVED, e => this.handleSlotMoved(e.detail));
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

  async handleSlotSetted(slot: SlotComplete) {
    await BoardsService.setSlot(this.boardComponent.board.id, slot);

    emitEvent<BoardSelectedEvent>(BoardsEvent.BOARD_SELECTED, {
      boardId: this.boardComponent.board.id
    });
  }

  async handleSlotMoved(event: SlotMovedEvent) {
    await BoardsService.setSlot(this.boardComponent.board.id, event.updatedSlot);
    await BoardsService.setSlot(this.boardComponent.board.id, event.emptySlot);

    emitEvent<BoardSelectedEvent>(BoardsEvent.BOARD_SELECTED, {
      boardId: this.boardComponent.board.id
    });
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
