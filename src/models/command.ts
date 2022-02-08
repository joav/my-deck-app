import { Params } from "./params";

export interface Command {
    name: string;
    defaultParams?: Params;
}