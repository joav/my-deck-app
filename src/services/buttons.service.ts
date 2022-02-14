import { environment } from "../environment/environment";
import { Button } from "../models/button";

export class ButtonsService {
  static async getButtons(): Promise<Button[]> {
    return fetch(`${environment.api}buttons`).then(r => r.json());
  }

  static async getButton(buttonId: string): Promise<Button> {
    return fetch(`${environment.api}buttons/${buttonId}`).then(r => r.json());
  }

  static async createButton(button: Button): Promise<Button> {
    return fetch(`${environment.api}buttons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(button),
    }).then(r => r.json());
  }

  static async updateButton(button: Button): Promise<Button> {
    return fetch(`${environment.api}buttons/${button.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(button),
    }).then(r => r.json());
  }

  static async deleteButton(buttonId: string): Promise<any> {
    return fetch(`${environment.api}buttons/${buttonId}`, {method: 'DELETE'}).then(r => r.json());
  } 
}
