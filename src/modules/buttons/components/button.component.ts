import { Button } from "../../../models/button";
import { BaseComponent } from "../../base.component";

export class ButtonComponent implements BaseComponent {
  constructor(private el: HTMLElement, private parent: HTMLElement, private button: Button) { }

  async init() {

  }
}
