import { Params } from "./params";

export type Param = {
    key: string;
    label: string;
    placeholder?: string;
    type: string;
    data?: any;
    asyncLoadData?: boolean;
};

export interface Command {
    id: string;
    name: string;
    defaultParams?: Params;
    defaultIcon?: string;
    params?: Param[];
    showCommand?: boolean;
}
