import { Wallettype } from "../enumerated/wallettype";

export interface Wallet {
	id?: number;
	walletType?: Wallettype;
	userId?: number;
	number?: number;
	value?: number;
}
