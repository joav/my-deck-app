import { BoardsService } from "../../../services/boards.service";
import { BaseComponent } from "../../base.component";
import { modalInstance } from "../../modal/modal.module";
import { emitEvent } from "../../shared/events-functions";
import { BoardsEvent } from "../models/boards-event";

export class CreateBoardComponent implements BaseComponent {
  private form: HTMLFormElement;

  constructor(private numBoards: number) {
    this.init();
  }

  async init() {
    modalInstance.open({
      title: "Nuevo tablero",
      body: this.printForm(),
      maxWidth: "360px",
    });
    this.form = document.querySelector('#new-board');
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
  }

  printForm() {
    return `<form id="new-board" class="form">
      <p class="form__line"><input class="form__input" placeholder="Nombre del tablero" name="board_name" /></p>
      <p class="form__line"><button class="form__submit">Crear</button></p>
    </form>`;
  }

  async onSubmit(e: SubmitEvent) {
    e.preventDefault();
    const boardName = this.form.board_name.value || `Tablero ${this.numBoards}`;

    await this.addBoard(boardName);

    modalInstance.doClose();
  }

  async addBoard(boardName: string) {
    await BoardsService.createBoard(boardName);

    emitEvent(BoardsEvent.BOARD_ADDED);
  }
}
