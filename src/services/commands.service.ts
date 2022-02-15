import { environment } from "../environment/environment";
import { CommandsData } from "../models/commands-data";
import { ParamsData } from "../models/params-data";

export class CommandsService {
  static commandsData: CommandsData;

  static async getCommandsData(): Promise<CommandsData> {
    if (CommandsService.commandsData) return Promise.resolve(CommandsService.commandsData);
    return fetch(`${environment.api}commands`).then(r => r.json()).then(c => {
      CommandsService.commandsData = c;
      return CommandsService.commandsData;
    });
  }

  static async getCommandData(commandId: string): Promise<ParamsData> {
    return fetch(`${environment.api}commands/${commandId}/data`).then(r => r.json());
  }
}
