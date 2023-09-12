import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Point } from '../interfaces/point';

@Injectable({
  providedIn: 'root'
})
export class PointService {

  headers = new HttpHeaders();

  constructor(private usvc: UserService, private http:HttpClient) { }

  findByWallet(walletId:any){
    this.headers = this.headers.set(
      'Authorization',
      'Bearer ' + this.usvc.getToken()
    );
    return this.http.get<Point[]>('http://localhost:8080/api/point/bywallet/'+ walletId , {headers: this.headers})
  }

  findByWalletAndDate(walletId:any, date:string){
    this.headers = this.headers.set(
      'Authorization',
      'Bearer ' + this.usvc.getToken()
    );
    return this.http.get<Point>('http://localhost:8080/api/point/bywallet/'+ walletId + '/' + date , {headers: this.headers})
  }

}
