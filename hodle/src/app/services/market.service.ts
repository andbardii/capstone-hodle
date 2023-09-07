import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  headers = new HttpHeaders();

  constructor(private http: HttpClient, private router: Router){}

  searchAsset(keywords: string) {
      console.log(keywords);
      this.headers = this.headers.set('X-RapidAPI-Host', 'alpha-vantage.p.rapidapi.com')
                                 .set('X-RapidAPI-Key', 'f4620064b9mshdb8d1bb25f138ebp15508ajsn932fd197513a');

      return this.http.get('https://alpha-vantage.p.rapidapi.com/query?keywords=' + Object.values(keywords) +'&function=SYMBOL_SEARCH&datatype=json', {
        headers: this.headers
      });
  }

}
