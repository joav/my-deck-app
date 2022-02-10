import { Command } from "../../../models/command";
import { Group } from "../../../models/group";
import { WithComponentsComponent } from "../../with-components.component";
import { CommandItemComponent } from "./command-item.component";

export class GroupComponent extends WithComponentsComponent {
  private childrenParent: HTMLElement;
  constructor(private el: HTMLElement, private group: Group, private commands: Command[]) {
    super();
    this.childrenParent = el.querySelector('.commads__list-children');
  }

  async init() {
    this.childrenParent.innerHTML = this.printCommands();
    this.childrenParent.querySelectorAll('.commands__list-item')
      .forEach((el, i) => this.components.push(
        new CommandItemComponent((el as HTMLElement), this.childrenParent, this.commands[i])
      ));
    await super.init();
  }

  printCommands() {
    return this.commands.map(c => `
      <p class="commands__list-item"><span class="commands__list-item-name">${c.name}</span></p>
    `)
      .join('');
  }
}
