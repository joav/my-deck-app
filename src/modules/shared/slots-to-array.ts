import { Board, Slot } from "../../models/board";

export type SlotComplete = Slot & {slotId: string};

export function slotsToArray(board: Board) {
  return Object.entries(board.slots).map<SlotComplete>(entry => ({...entry[1], slotId: entry[0]}));
}
