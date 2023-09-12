import { Asset } from "./asset";

export interface Point {
	id?: number;
	walletId?: number;
	assets?: Asset[];
  date?: Date;
  invested?: number;
  value?: number;
  high?: number;
	low?: number;
}

