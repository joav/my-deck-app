import { environment } from "../../../environment/environment";
import { Action } from "../../../models/button";
import { Command, Param } from "../../../models/command";
import { CommandsData } from "../../../models/commands-data";
import { Params } from "../../../models/params";
import { ParamsData } from "../../../models/params-data";
import { CommandsService } from "../../../services/commands.service";
import { BaseComponent } from "../../base.component";
import { modalInstance } from "../../modal/modal.module";

export type CommandConfigurationResult = Action;

export class CommandConfigurationComponent implements BaseComponent {
  private form: HTMLFormElement;
  private commandSelect: HTMLSelectElement;
  private paramsContainer: HTMLElement;
  private _result: Promise<CommandConfigurationResult>;
  private command: Command;
  private data: ParamsData;

  constructor(private commandsData:CommandsData, private commandId = "", private params: Params = {}) {
    this.init();
  }
  
  async init() {
    this._result = new Promise(async r => {
      if (this.commandId) {
        this.command = this.commandsData.commands[this.commandId];
        await this.getParamsData();
      }

      modalInstance.open({
        title: "Configurar Paso",
        body: this.printForm(),
        maxWidth: "440px",
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
    <p class="form__line form__line_flex">
      <label class="form__label">Selecciona un atajo</label>
      <select class="form__input form__input_flex" name="command_id" id="command_id">
        <option value="">Seleccionar un commando</option>
        ${this.printCommands()}
      </select>
    </p>
    <div class="params">
      ${this.printParams()}
    </div>
    <p class="form__line"><button class="form__submit">Guardar</button></p>
  </form>`;
  }

  registerEvents(resolve: (value: CommandConfigurationResult | PromiseLike<CommandConfigurationResult>) => void) {
    this.form.addEventListener('submit', (e) => this.onSubmit(e, resolve));
    
    this.commandSelect.addEventListener('change', () => this.handleCommandChange());
  }

  async onSubmit(e: SubmitEvent, resolve: (value: CommandConfigurationResult | PromiseLike<CommandConfigurationResult>) => void) {
    e.preventDefault();
    if (this.commandId) resolve({
      commandId: this.commandId,
      params: await this.getParams()
    });
    else resolve(null);
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
    await this.getParamsData();
    this.paramsContainer.innerHTML = this.printParams();
  }

  async getParamsData() {
    this.data = this.commandId?await CommandsService.getCommandData(this.commandId):null;
  }

  printParams() {
    return (
      this.command?.params?.map(p => this.printParam(p))
        .join("")
        || ""
    );
  }
  
  printParam(param: Param) {
    let input = "";
    let preInput = "";
    switch (param.type) {
      case "file":
        preInput = `<p class="form__line form__line_flex">
        <label class="form__label">${(param.placeholder || param.label) || ''}</label>
        <select
          class="form__input form__input_flex"
          name="param_${param.key}"
          id="param_${param.key}"
          value="${this.params[param.key]}"
        >
          ${this.printParamSelectData(param)}
        </select>
      </p>`;
        input = `<input
        class="form__input form__input_flex"
        name="param_${param.key}_file"
        id="param_${param.key}_file"
        type="${param.type}"
      />`;
        break;
      case "select":
        input = `<select
        class="form__input form__input_flex"
        name="param_${param.key}"
        id="param_${param.key}"
        value="${this.params[param.key]}"
        placeholder="${(param.placeholder || param.label) || ''}"
      >
        ${this.printParamSelectData(param)}
      </select>`;
        break;
    
      default:
        input = `<input
        class="form__input form__input_flex"
        name="param_${param.key}"
        id="param_${param.key}"
        type="${param.type}"
        value="${this.params[param.key]}"
        placeholder="${(param.placeholder || param.label) || ''}"
      />`;
      break;
    }

    return `${preInput}<p class="form__line form__line_flex">
    <label class="form__label">${param.label}</label>
    ${input}
  </p>`;
  }

  async getParams(): Promise<Params> {
    const params: Params = {};
    await this.saveFiles();
    if (this.command?.params) {
      for (const param of this.command.params) {
        params[param.key] = this.form[`param_${param.key}`].value;
      }
    }
    return params;
  }

  printParamSelectData(param: Param) {
    return (param.asyncLoadData?this.data[param.key]:param.data)
      .map(d => `<option value="${d.id}" ${this.params[param.key] === d.id?"selected":""}>${d.name}</option>`)
      .join("");
  }

  async saveFiles() {
    const promises: Promise<{id: string; param: string;}>[] = [];
    this.form.querySelectorAll<HTMLInputElement>(`input[type="file"]`).forEach(input => {
      if (input.files.length) {
        promises.push(this.saveFile(input));
      }
    });
    if (promises.length) {
      const responses = await Promise.all(promises);
      responses.forEach(r => {
        if (r) {
          this.form[`param_${r.param}`].innerHTML += `<option value="${r.id}">File</option>`;
          this.form[`param_${r.param}`].value = r.id;
        }
      });
    }
  }

  async saveFile(input: HTMLInputElement) {
    const formData = new FormData();
    formData.set('file', input.files[0]);
    const param = input.id.split("_").slice(1).slice(0, -1).join("_");
    try {
      const response = await fetch(`${environment.api}files/${this.commandId}__${param}`, {
        method: "POST",
        body: formData
      });

      const {id} = await response.json();
           
      return {param, id};
    } catch (error) {
      return null;
    }
  }
}
