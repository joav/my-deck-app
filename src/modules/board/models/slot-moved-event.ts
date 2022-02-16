import { SlotComplete } from "../../shared/slots-to-array";

export interface SlotMovedEvent {
  updatedSlot: SlotComplete,
  emptySlot: SlotComplete
}
