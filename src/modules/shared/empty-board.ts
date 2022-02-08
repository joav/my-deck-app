import { Board } from "../../models/board";

export function emptyBoard(name = "EMPTY_BOARD"): Board {
    return {
        id: "EMPTY_BOARD",
        name,
        slots: {
            slot1: {
                state: 'EMPTY'
            },
            slot2: {
                state: 'EMPTY'
            },
            slot3: {
                state: 'EMPTY'
            },
            slot4: {
                state: 'EMPTY'
            },
            slot5: {
                state: 'EMPTY'
            },
            slot6: {
                state: 'EMPTY'
            },
            slot7: {
                state: 'EMPTY'
            },
            slot8: {
                state: 'EMPTY'
            },
            slot9: {
                state: 'EMPTY'
            },
            slot10: {
                state: 'EMPTY'
            },
            slot11: {
                state: 'EMPTY'
            },
            slot12: {
                state: 'EMPTY'
            },
            slot13: {
                state: 'EMPTY'
            },
            slot14: {
                state: 'EMPTY'
            },
            slot15: {
                state: 'EMPTY'
            }
        }
    };
}
