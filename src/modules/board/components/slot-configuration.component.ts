import { Action } from "../../../models/button";
import { CommandsData } from "../../../models/commands-data";
import { CommandsService } from "../../../services/commands.service";
import { RandomService } from "../../../services/random.service";
import { BaseComponent } from "../../base.component";
import { modalInstance } from "../../modal/modal.module";
import { emitEvent } from "../../shared/events-functions";
import { SlotComplete } from "../../shared/slots-to-array";
import { Sortable } from "../../shared/sortable";
import { BoardEvent } from "../models/board-event";
import { CommandConfigurationComponent } from "./command-configuration.component";

export class SlotConfigurationComponent implements BaseComponent {
  private form: HTMLFormElement;
  private commandsData: CommandsData;

  constructor(private slot: SlotComplete) {
    this.init();
  }

  async init() {
    this.commandsData = await CommandsService.getCommandsData();
    modalInstance.open({
      title: "Configurar slot",
      body: this.printForm(),
      maxWidth: "360px",
      withTabs: true,
    });

    this.form = document.querySelector('#slot-configuration');

    this.registerEvents();
    
    new Sortable(this.form.querySelector<HTMLElement>('.steps'), () => this.updateList());
  }

  printForm() {
    return `<form id="slot-configuration" class="form">
    <div class="form__tabs">
      <div class="form__tab-title" data-tab="basic">Básico</div>
      <div class="form__tab-title" data-tab="steps">Pasos</div>
    </div>
    <div class="form__tab" data-tab="basic">
      <p class="form__line">
        <input
          class="form__input"
          placeholder="Nombre del botón"
          name="button_name"
          value="${this.slot.button?.name || ""}"
        />
      </p>
      <p class="form__line">
        <input
          class="form__input"
          placeholder="Icono del botón"
          name="button_icon"
          value="${this.slot.button?.icon || ""}"
        />
      </p>
      <p class="form__line">
        <input
          type="color"
          class="form__input form__input-color"
          id="button_color"
          name="button_color"
          value="${this.slot.button?.color || RandomService.color()}"
        />
      </p>
    </div>
    <div class="form__tab" data-tab="steps">
      <div class="steps">
        ${this.printSteps()}
      </div>
      <p class="form__line"><button type="button" class="form__button btn-add">Añadir</button></p>
    </div>
    <p class="form__line"><button class="form__submit">Guardar</button></p>
  </form>`;
  }

  registerEvents() {
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
    this.form.querySelector<HTMLElement>('.btn-add').addEventListener('click', (e) => this.handleAddStep(e));
    this.form.querySelectorAll<HTMLElement>(".step__btn")
      .forEach(btn => btn.addEventListener('click', () => this.handleStepBtnClick(btn)));
  }

  onSubmit(e: SubmitEvent) {
    e.preventDefault();
    this.slot.button = {
      name: this.form['button_name'].value,
      icon: this.form['button_icon'].value,
      color: this.form['button_color'].value,
      steps: this.slot.button?.steps || [],
    };
    emitEvent(BoardEvent.SLOT_SETTED, this.slot);
    modalInstance.doClose();
  }

  printSteps() {
    return (
      this.slot.state === "EMPTY"
        ? ""
        : this.slot.button.steps.map((s, i) => this.newStep(s, i))
          .join("")
    );
  }

  async handleAddStep(e: MouseEvent) {
    e.preventDefault();

    modalInstance.doClose();
    const commandConfiguration = new CommandConfigurationComponent(this.commandsData);
    const step = await commandConfiguration.result;
    if (step && step.commandId) {
      const line = document.createElement('div');
      this.form.querySelector(".steps").append(line);
  
      const stepIndex = this.form.querySelectorAll(".step").length;
      line.outerHTML = this.newStep(step, stepIndex);
  
      this.form.querySelectorAll<HTMLElement>(`.step[data-step="${stepIndex}"] .step__btn`)
        .forEach(btn => btn.addEventListener('click', () => this.handleStepBtnClick(btn)));
  
      if (this.slot.button) this.slot.button.steps.push(step);
      else {
        this.slot.state = "FULL";
        this.slot.button = {
          name: this.form['button_name'].value,
          icon: this.form['button_icon'].value,
          color: this.form['button_color'].value,
          steps: [step]
        };
      }
    }

    await this.init();
    modalInstance.changeTab("steps");
  }

  newStep(step: Action, index: number) {
    return `<div class="form__line step" data-step="${index}" draggable="true">
      <div class="step__name">${this.commandsData.commands[step.commandId]?.name || "Tablero específico"}</div>
      <div class="step__actions">
        ${this.commandsData.commands[step.commandId]?.defaultParams?'<div class="step__btn step__btn_config">⚙</div>':''}
        <div class="step__btn step__btn_remove">🗑</div>
      </div>
    </div>`;
  }

  handleStepBtnClick(btn: HTMLElement) {
    const action = btn.classList[1].split("_").reverse()[0];
    switch (action) {
      case "config":
        this.handleStepConfig(btn);
        break;

      case "remove":
        this.handleStepRemove(btn);
        break;
    
      default:
        break;
    }
  }

  async handleStepConfig(btn: HTMLElement) {
    const stepEl = btn.parentElement.parentElement;
    const stepIndex = +stepEl.dataset.step;
    const step = this.slot.button.steps[stepIndex];
    const commandConfiguration = new CommandConfigurationComponent(this.commandsData, step.commandId || "", {...step.params} || {});
    const commandResult = await commandConfiguration.result;
    if (commandResult) {
      step.commandId = commandResult.commandId;
      step.params = commandResult.params;
    }
    await this.init();
    modalInstance.changeTab("steps");
  }

  handleStepRemove(btn: HTMLElement) {
    const step = btn.parentElement.parentElement;

    step.remove();

    this.updateList();
  }

  updateList() {
    const newList: Action[] = [];

    this.form.querySelectorAll<HTMLElement>('.step').forEach(el => {
      newList.push(this.slot.button.steps[+el.dataset.step]);
    });

    this.slot.button.steps = newList;

    this.form.querySelector('.steps').innerHTML = this.printSteps();

    this.form.querySelectorAll<HTMLElement>(".step__btn")
      .forEach(btn => btn.addEventListener('click', () => this.handleStepBtnClick(btn)));
  }
}
