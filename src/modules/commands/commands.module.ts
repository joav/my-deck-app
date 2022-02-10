import { Command } from "../../models/command";
import { Group } from "../../models/group";
import { CommandsService } from "../../services/commands.service";
import { BaseModule } from "../base.module";
import { WithComponentsModule } from "../with-components.module";
import { GroupComponent } from "./components/group.component";

export class CommandsModule extends WithComponentsModule {
  private list: HTMLElement;
  constructor() {
    super();
    this.list = document.querySelector('.commands__list');
  }
  async init() {
    const commandsData = await CommandsService.getCommandsData();
    const groupCommandsMap = new Map(
      commandsData.groups.map(g => ([g.id, g.commandsToShow.map(c => commandsData.commands[`${g.id}__${c}`])]))
    );
    this.list.innerHTML = this.printGroups(commandsData.groups);
    this.list.querySelectorAll('.commands__list-item.commands__list-item_parent')
      .forEach((el, i) => this.components.push(
        new GroupComponent(
          (el as HTMLElement),
          commandsData.groups[i],
          groupCommandsMap.get(commandsData.groups[i].id),
        )
      ));
    await super.init();
  }

  printGroups(groups: Group[]) {
    return groups.map(g => `<div class="commands__list-item commands__list-item_parent">
    <p class="commands__list-item-name_parent">${g.name}</p>
    <div class="commads__list-children">
    </div>
  </div>`)
      .join('');
  }
}
