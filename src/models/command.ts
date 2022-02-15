import { Params } from "./params";
import { ParamData } from "./params-data";

export type Param = {
  key: string;
  label: string;
  placeholder?: string;
  type: string;
  data?: ParamData[];
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
