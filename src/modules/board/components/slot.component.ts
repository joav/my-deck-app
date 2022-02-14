import { Button } from "../../../models/button";
import { Command } from "../../../models/command";
import { ButtonsService } from "../../../services/buttons.service";
import { BaseComponent } from "../../base.component";
import { ButtonsEvent } from "../../buttons/models/buttons-event";
import { emitEvent } from "../../shared/events-functions";
import { SlotComplete } from "../../shared/slots-to-array";
import { BoardEvent } from "../models/board-event";

export class SlotComponent implements BaseComponent {
  constructor(private el: HTMLElement, private parent: HTMLElement, private slot: SlotComplete) { }

  async init() {
    this.registerEvents();
  }

  registerEvents() {
    this.el.addEventListener("dragover", e => e.preventDefault());
    this.el.addEventListener("drop", e => this.handleDrop(e));
    this.el.querySelectorAll(".board__item-btn")
      .forEach(btn => btn.addEventListener('click', () => this.handleBtnClick((btn as HTMLElement))));
  }

  handleDrop(e: DragEvent) {
    const button: Button = JSON.parse(e.dataTransfer.getData("button"));
    let shouldConfigure = false;
    if (e.dataTransfer.getData('shouldConfigure')) {
      shouldConfigure = JSON.parse(e.dataTransfer.getData('shouldConfigure'));
    }
    let command: Command;
    if (shouldConfigure) {
      command = JSON.parse(e.dataTransfer.getData("command"));
    } else {
      this.slot.button = button;
      emitEvent(BoardEvent.SLOT_SETTED, this.slot);
    }
  }

  handleBtnClick(btn: HTMLElement) {
    const action = btn.classList[1].split("_").reverse()[0];
    switch (action) {
      case "add":
        this.handleAdd();
        break;
        
      case "save":
        this.handleSave();
        break;

      case "config":
        this.handleConfig();
        break;

      case "remove":
        this.handleRemove();
        break;
    
      default:
        break;
    }
  }

  async handleAdd() {
    console.log('handleAdd');
  }
  
  async handleSave() {
    await ButtonsService.createButton({...this.slot.button, id: ""});
    emitEvent(ButtonsEvent.BUTTON_ADDED);
  }

  handleConfig() {
    console.log('handleConfig');
  }

  handleRemove() {
    this.slot.button = null;
    emitEvent(BoardEvent.SLOT_SETTED, this.slot);
  }
}
