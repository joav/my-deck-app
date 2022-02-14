import { Button } from "../../../models/button";
import { ButtonsService } from "../../../services/buttons.service";
import { onEvent } from "../../shared/events-functions";
import { WithComponentsComponent } from "../../with-components.component";
import { ButtonsEvent } from "../models/buttons-event";
import { ButtonComponent } from "./button.component";

const MIN_SPACE = 5;

export class SliderComponent extends WithComponentsComponent {
  private slider: HTMLElement;
  private left: HTMLButtonElement;
  private right: HTMLButtonElement;
  private steps = 0;
  constructor(private el: HTMLElement, private parent: HTMLElement) {
    super();
    this.slider = this.el.querySelector('.btns__list-wrapper');
    this.slider.style.left = '0px';
    this.left = this.el.querySelector('.btns__arrow-left');
    this.right = this.el.querySelector('.btns__arrow-right');
  }

  async init() {
    this.registerEvents();
    await this.updateButtons();
    window.addEventListener('resize', () => {
      this.reset();
    });
    this.updateArrowsState();
  }

  registerEvents() {
    this.left.addEventListener('click', e => {
      this.toRight();
    });
    this.right.addEventListener('click', e => {
      this.toLeft();
    });
    onEvent(ButtonsEvent.BUTTON_ADDED, e => this.updateButtons());
  }

  async updateButtons() {
    await this.getButtons();
    await super.init();
  }

  async getButtons() {
    this.components = [];
    const buttons = await ButtonsService.getButtons();
    this.slider.innerHTML = this.printButtons(buttons);
    this.slider.querySelectorAll('.btns__item').forEach((e, i) => this.components.push(new ButtonComponent((e as HTMLElement), this.slider, buttons[i])));
  }

  printButtons(buttons: Button[]) {
    return buttons.map(b => `<div class="btns__item" ${this.buttonBackground(b)}>
    <p class="btns__item-name">${b.name}</p>
    <div class="btns__item-actions"><div class="btns__item-action">🗑</div></div>
  </div>`)
      .join("");
  }

  buttonBackground(button: Button, type: "color" | "image" = "color"): string {
    return (
      type === "color"
        ? `style="background-color: ${button.color};"`
        : `style="background-image: url('${button.icon}');"`
    );
  }

  reset() {
    this.slider.style.left = '0px';
    this.steps = 0;
  }
  
  get sliderWidth() {
    return this.slider.getBoundingClientRect().width;
  }

  get canMoveToLeft() {
    return this.steps <= this.components.length - 1;
  }

  get canMoveToRight() {
    return !!+this.slider.style.left.split('px')[0];
  }

  get buttonWidth() {
    return this.el.querySelector('.btns__item').getBoundingClientRect().width;
  }

  toLeft() {
    const current = +this.slider.style.left.split('px')[0];
    const additional = current?0:5;
    this.steps++;
    if (this.canMoveToLeft) {
      this.moveSlider(current - (this.buttonWidth + MIN_SPACE + additional));
    }
    this.updateArrowsState();
  }

  toRight() {
    const current = +this.slider.style.left.split('px')[0];
    const additional = this.steps === 1?5:0;
    this.steps--;
    if (this.canMoveToRight) {
      this.moveSlider(this.steps?current + (this.buttonWidth + MIN_SPACE + additional):0);
    }
    this.updateArrowsState();
  }

  updateArrowsState() {
    if (!this.canMoveToLeft) {
      this.right.disabled = true;
    } else {
      this.right.disabled = false;
    }

    if (!this.canMoveToRight) {
      this.left.disabled = true;
    } else {
      this.left.disabled = false;
    }
  }

  moveSlider(q: number) {
    this.slider.style.left = q + "px";
  }
}
