import { Button } from "./button";

export interface Board {
    id: string;
    name: string;
    slots: Slots;
}

export type Slots = {
    slot1: Slot;
    slot2: Slot;
    slot3: Slot;
    slot4: Slot;
    slot5: Slot;
    slot6: Slot;
    slot7: Slot;
    slot8: Slot;
    slot9: Slot;
    slot10: Slot;
    slot11: Slot;
    slot12: Slot;
    slot13: Slot;
    slot14: Slot;
    slot15: Slot;
}

export interface Slot {
    state: | 'EMPTY' | 'FULL' | 'EXECUTING';
    button?: Button;
}