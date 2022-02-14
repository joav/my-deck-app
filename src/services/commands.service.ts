import { environment } from "../environment/environment";
import { CommandsData } from "../models/commands-data";

export class CommandsService {
  static commandsData: CommandsData;
  static async getCommandsData(): Promise<CommandsData> {
    if (CommandsService.commandsData) return Promise.resolve(CommandsService.commandsData);
    return fetch(`${environment.api}commands`).then(r => r.json()).then(c => {
      CommandsService.commandsData = c;
      return CommandsService.commandsData;
    });
  };
}
