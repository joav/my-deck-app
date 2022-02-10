import { Params } from "./params";

export type Action = {
  commandId: string;
  params: Params;
}

export interface Button {
  id?: string;
  name: string;
  icon: string;
  color: string;
  steps: Action[];
}
