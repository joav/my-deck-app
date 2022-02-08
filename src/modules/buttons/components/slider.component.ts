import { WithComponentsComponent } from "../../with-components.component";

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
    this.left.addEventListener('click', e => {
      this.toRight();
    });
    this.right.addEventListener('click', e => {
      this.toLeft();
    });
    this.el.querySelectorAll('.btns__item').forEach((e) => this.components.push({init: async () => {}}));
    super.init();
    window.addEventListener('resize', () => {
      this.reset();
    });
    this.updateArrowsState();
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
