import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Wallettype } from '../enumerated/wallettype';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  headers = new HttpHeaders();

  constructor(private usvc: UserService, private http: HttpClient) { }

  addWallet(type: Wallettype) {
    this.headers = this.headers.set(
      'Authorization',
      'Bearer ' + this.usvc.getToken()
    );
    console.log(type);
    return this.http.post('http://localhost:8080/api/wallet/add/' + this.usvc.getId(), Object.values(type), {headers: this.headers});
  }
}
