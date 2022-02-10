import { environment } from "../environment/environment";
import { CommandsData } from "../models/commands-data";

export class CommandsService {
  static async getCommandsData(): Promise<CommandsData> {
    return fetch(`${environment.api}commands`).then(r => r.json());
  };
}
