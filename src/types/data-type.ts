export interface Outlay {
  cost?: number;
  label?: string;
  text?: string;
}

export interface Bill {
  year?: number | string;
  month?: number | string;
  show?: boolean;
  surplus?: number;
  total?: number;
  outlays?: Outlay[];
}
