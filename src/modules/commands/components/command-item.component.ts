import { Button } from "../../../models/button";
import { Command } from "../../../models/command";
import { RandomService } from "../../../services/random.service";
import { BaseComponent } from "../../base.component";

export class CommandItemComponent implements BaseComponent {
  constructor(private el: HTMLElement, private parent: HTMLElement, private command: Command) { }

  async init() {
    this.el.draggable = true;
    this.registerEvents();
  }

  registerEvents() {
    this.el.addEventListener("dragstart", e => this.handleDrag(e));
  }

  handleDrag(e: DragEvent) {
    const button: Button = {
      name: this.command.name,
      icon: this.command.defaultIcon || "",
      color: this.command.defaultIcon?"":RandomService.color(),
      steps: [
        {
          commandId: this.command.id,
          params: this.command.defaultParams || {}
        }
      ]
    };
    e.dataTransfer.setData("button", JSON.stringify(button));
  }
}
