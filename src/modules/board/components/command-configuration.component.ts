import { Action } from "../../../models/button";
import { Command, Param } from "../../../models/command";
import { CommandsData } from "../../../models/commands-data";
import { Params } from "../../../models/params";
import { BaseComponent } from "../../base.component";
import { modalInstance } from "../../modal/modal.module";

export type CommandConfigurationResult = Action;

export class CommandConfigurationComponent implements BaseComponent {
  private form: HTMLFormElement;
  private commandSelect: HTMLSelectElement;
  private paramsContainer: HTMLElement;
  private _result: Promise<CommandConfigurationResult>;
  private command: Command;

  constructor(private commandsData:CommandsData, private commandId = "", private params: Params = {}) {
    this.init();
  }
  
  async init() {
    this._result = new Promise(r => {
      if (this.commandId) this.command = this.commandsData.commands[this.commandId];

      modalInstance.open({
        title: "Configurar Paso",
        body: this.printForm(),
        maxWidth: "360px",
        onClose: () => r(null)
      });

      this.form = document.querySelector('#command-configuration');
      this.commandSelect = this.form.querySelector("#command_id");
      this.paramsContainer = this.form.querySelector(".params");

      this.registerEvents(r);
    });
  }

  get result() {
    return this._result;
  }

  printForm() {
    return `<form id="command-configuration" class="form">
    <p class="form__line">
      <select name="command_id" id="command_id">
        <option>Seleccionar un commando</option>
        ${this.printCommands()}
      </select>
    </p>
    <div class="form__line params">
      ${this.printParams()}
    </div>
    <p class="form__line"><button class="form__submit">Guardar</button></p>
  </form>`;
  }

  registerEvents(resolve: (value: CommandConfigurationResult | PromiseLike<CommandConfigurationResult>) => void) {
    this.form.addEventListener('submit', (e) => this.onSubmit(e, resolve));
    
    this.commandSelect.addEventListener('change', () => this.handleCommandChange());
  }

  onSubmit(e: SubmitEvent, resolve: (value: CommandConfigurationResult | PromiseLike<CommandConfigurationResult>) => void) {
    e.preventDefault();
    resolve({
      commandId: this.commandId,
      params: this.getParams()
    });
    modalInstance.doClose();
  }

  printCommands() {
    return Object.values(this.commandsData.commands)
      .map(c => `<option value="${c.id}" ${c.id === this.commandId?'selected':''}>${c.name}</option>`)
      .join("");
  }

  async handleCommandChange() {
    this.commandId = this.commandSelect.value;
    this.command = this.commandsData.commands[this.commandId];
    this.params = this.command?.defaultParams || {};
    this.paramsContainer.innerHTML = this.printParams();
  }

  printParams() {
    return (
      this.command?.params?.map(p => this.printParam(p))
        .join("")
        || ""
    );
  }
  
  printParam(param: Param) {
    switch (param.type) {
      case "number":
        return `<p class="form__line">
          <label>${param.label}</label>
          <input
            name="param_${param.key}"
            id="param_${param.key}"
            type="${param.type}"
            value="${this.params[param.key]}"
            placeholder="${(param.placeholder || param.label) || ''}"
          />
        </p>`;
    
      default:
        return `<p class="form__line">
          <label>${param.label}</label>
          <input
            name="param_${param.key}"
            id="param_${param.key}"
            value="${this.params[param.key]}"
            placeholder="${(param.placeholder || param.label) || ''}"
          />
        </p>`;
    }
  }

  getParams(): Params {
    const params: Params = {};
    if (this.command?.params) {
      for (const param of this.command.params) {
        params[param.key] = this.form[`param_${param.key}`].value;
      }
    }
    return params;
  }
}
