import { Button } from "../../../models/button";
import { Command } from "../../../models/command";
import { Params } from "../../../models/params";
import { ButtonsService } from "../../../services/buttons.service";
import { BaseComponent } from "../../base.component";
import { ButtonsEvent } from "../../buttons/models/buttons-event";
import { emitEvent } from "../../shared/events-functions";
import { SlotComplete } from "../../shared/slots-to-array";
import { BoardEvent } from "../models/board-event";
import { SlotFullAlertComponent, SlotFullAlertResult } from "./slot-full-alert.component";

export class SlotComponent implements BaseComponent {
  constructor(private el: HTMLElement, private parent: HTMLElement, private slot: SlotComplete) { }

  async init() {
    this.el.draggable = this.slot.state !== 'EMPTY';
    this.registerEvents();
  }

  registerEvents() {
    this.el.addEventListener("dragover", e => e.preventDefault());
    this.el.addEventListener("drop", e => this.handleDrop(e));
    this.el.addEventListener("dragstart", e => this.handleDrag(e));
    this.el.querySelectorAll(".board__item-btn")
      .forEach(btn => btn.addEventListener('click', () => this.handleBtnClick((btn as HTMLElement))));
  }

  async handleDrop(e: DragEvent) {
    const slotId = e.dataTransfer.getData("slotId");
    const button: Button = JSON.parse(e.dataTransfer.getData("button"));

    let shouldConfigure = false;
    if (e.dataTransfer.getData('shouldConfigure')) {
      shouldConfigure = JSON.parse(e.dataTransfer.getData('shouldConfigure'));
    }

    let command: Command;
    if (shouldConfigure) {
      command = JSON.parse(e.dataTransfer.getData("command"));
    }
    
    if (slotId !== this.slot.slotId) {
      let action: SlotFullAlertResult = "replace";
      if (this.slot.state !== "EMPTY") {
        const alert = new SlotFullAlertComponent();
        action = await alert.result;
      }

      switch (action) {
        case "replace":
          this.slot.button = button;
          break;
        
        case "add":
          this.slot.button.steps.push(...button.steps);
          emitEvent(BoardEvent.SLOT_SETTED, this.slot);
          break;
          
        default:
          return;
      }

      if (shouldConfigure) {
        // TODO: Configure command
        
        const buttonCommand = button.steps.reverse().find(s => s.commandId === command.id);
        let params: Params = {...buttonCommand.params};

        buttonCommand.params = params;
      }
      
      emitEvent(BoardEvent.SLOT_SETTED, this.slot);

      if (slotId) {
        emitEvent<SlotComplete>(BoardEvent.SLOT_SETTED, {
          slotId,
          state: "EMPTY",
          button: null,
        });
      }
    }
  }

  handleDrag(e: DragEvent) {
    e.dataTransfer.setData("slotId", this.slot.slotId);
    e.dataTransfer.setData("button", JSON.stringify({...this.slot.button, id: null}));
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
