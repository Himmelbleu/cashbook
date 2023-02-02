export interface Outlay {
  cost?: number;
  label?: string;
  text?: string;
}

export interface Bill {
  year?: number;
  month?: number;
  surplus?: number;
  total?: number;
  outlays?: Outlay[];
}
