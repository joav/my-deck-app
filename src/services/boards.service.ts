import { environment } from "../environment/environment";
import { Board } from "../models/board";
import { SlotComplete } from "../modules/shared/slots-to-array";

export class BoardsService {
  static async getBoards(): Promise<Board[]> {
    return fetch(`${environment.api}boards`).then(r => r.json());
  }

  static async getBoard(boardId: string): Promise<Board> {
    return fetch(`${environment.api}boards/${boardId}`).then(r => r.json());
  }

  static async createBoard(boardName: string): Promise<Board> {
    return fetch(`${environment.api}boards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: `{"name": "${boardName}"}`,
    }).then(r => r.json());
  }

  static async updateBoard(board: Board): Promise<Board> {
    return fetch(`${environment.api}boards/${board.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(board),
    }).then(r => r.json());
  }

  static async setSlot(boardId: string, slot: SlotComplete): Promise<Board> {
    return fetch(`${environment.api}boards/${boardId}/slots/${slot.slotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slot),
    }).then(r => r.json());
  }
}
