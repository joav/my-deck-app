import { BaseModule } from "../base.module";

export type OpenOptions = {
  title?: string;
  body?: string;
  footer?: string;
  maxWidth?: string;
  hideClose?: boolean;
  disallowScape?: boolean;
  withTabs?: boolean;
  onClose?: () => void
};

export class ModalModule implements BaseModule {
  private modal: HTMLElement;
  private content: HTMLElement;
  private close: HTMLElement;
  private title: HTMLElement;
  private body: HTMLElement;
  private footer: HTMLElement;
  private allowScape = true;
  private opened = false;
  private onClose = () => {};
  constructor() {
    this.modal = document.querySelector('.modal');
    this.content = document.querySelector('.modal__content');
    this.close = document.querySelector('.modal__close');
    this.title = document.querySelector('.modal__title');
    this.body = document.querySelector('.modal__body');
    this.footer = document.querySelector('.modal__footer');
  }

  async init() {
    this.close.addEventListener('click', () => this.doClose(true));
    window.addEventListener('click', (e) => this.verifyOutside(e));
    document.body.addEventListener('keyup', (e) => this.verifyEscape(e));
  }

  open({
    title,
    body,
    footer,
    maxWidth,
    hideClose,
    disallowScape,
    withTabs,
    onClose,
  }: OpenOptions) {
    if (title) {
      this.title.innerHTML = title;
    } else {
      this.title.innerHTML = '';
    }

    if (body) {
      this.body.style.display = 'block';
      this.body.innerHTML = body;
    } else {
      this.body.style.display = 'none';
    }

    if (footer) {
      this.footer.innerHTML = footer;
    } else {
      this.footer.innerHTML = '';
    }

    if (maxWidth) {
      this.content.style.maxWidth = maxWidth;
    } else {
      this.content.style.maxWidth = "";
    }

    if (hideClose) {
      this.close.style.opacity = "0";
    } else {
      this.close.style.opacity = "1";
    }

    if (withTabs) {
      this.initTabs();
    }

    if (onClose) this.onClose = onClose;
    else this.onClose = () => {};

    this.allowScape = !disallowScape;
    
    this.show();
  }

  doClose(direct = false) {
    this.opened = false;
    this.modal.style.display = "none";
    if (direct) this.onClose();
  }

  verifyOutside(e: MouseEvent) {
    if (this.opened && this.allowScape && e.target === this.modal) {
      this.doClose(true);
    }
  }

  verifyEscape(e: KeyboardEvent) {
    if (this.opened && this.allowScape && e.key === "Escape") {
      this.doClose(true);
    }
  }

  show() {
    this.opened = true;
    this.modal.style.display = "block";
  }

  initTabs() {
    document.querySelectorAll<HTMLElement>('.form__tab-title')
      .forEach(el => el.addEventListener("click", () => this.changeTab(el.dataset.tab)));
    
    this.changeTab(document.querySelector<HTMLElement>('.form__tab-title').dataset.tab);
  }

  changeTab(tab: string) {
    // Reset
    document.querySelectorAll<HTMLElement>('.form__tab-title').forEach(el => el.classList.remove('form__tab-title_active'));
    document.querySelectorAll<HTMLElement>('.form__tab').forEach(el => el.classList.remove('form__tab_active'));

    // Add active class
    document.querySelector<HTMLElement>(`.form__tab-title[data-tab="${tab}"]`).classList.add('form__tab-title_active');
    document.querySelector<HTMLElement>(`.form__tab[data-tab="${tab}"]`).classList.add('form__tab_active');
  }
}

export const modalInstance = new ModalModule();
