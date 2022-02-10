import { Command } from "./command";
import { Group } from "./group";

export interface CommandsData {
    groups: Group[];
    commands: {
        [key: string]:  Command
    }
}
