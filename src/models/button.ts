import { Params } from "./params";

export interface Button {
    name: string;
    icon: string;
    color: string;
    commandId: string;
    params: Params;
}