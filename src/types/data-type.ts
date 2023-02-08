export interface IOutlay {
  cost?: number;
  text?: string;
  label?: string;
}

export interface IMonth {
  show?: boolean;
  budget?: number;
  surplus?: number;
  outlays?: IOutlay[];
}

type Month = Record<string, IMonth>;
export type Bill = Record<number | string, Month>;
