import { UserService } from './user.service';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Wallettype } from '../enumerated/wallettype';
import { Wallet } from '../interfaces/wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  headers = new HttpHeaders();

  constructor(private usvc: UserService, private http: HttpClient) { }

  // POST METHODS
  addWallet(type: Wallettype) {
    this.headers = this.headers.set(
      'Authorization',
      'Bearer ' + this.usvc.getToken()
    );
    console.log(type);
    return this.http.post<Wallet>('http://localhost:8080/api/wallet/add/' + this.usvc.getId() + '/' + Object.values(type),{} ,{headers: this.headers});
  }

  // GET METHODS
  findByUser(){
    this.headers = this.headers.set(
      'Authorization',
      'Bearer ' + this.usvc.getToken()
    );
    return this.http.get<Wallet[]>('http://localhost:8080/api/wallet/byuser/' + this.usvc.getId(), {headers: this.headers});
  }
}
