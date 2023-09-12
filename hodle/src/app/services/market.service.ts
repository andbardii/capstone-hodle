import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MarketService {


  headers = new HttpHeaders();

  constructor(private http: HttpClient){}

  // GET STOCK METHODS
  searchAsset(keywords: string) {
      console.log(keywords);
      this.headers = this.headers.set('X-RapidAPI-Host', 'twelve-data1.p.rapidapi.com')
                                 .set('X-RapidAPI-Key', 'f4620064b9mshdb8d1bb25f138ebp15508ajsn932fd197513a');

      return this.http.get('https://twelve-data1.p.rapidapi.com/symbol_search?symbol=' + Object.values(keywords) + '&outputsize=15', {
        headers: this.headers
      });
  }

  getMarketDailyView(params: any, time:string) {
    console.log(Object.values(params));
    this.headers = this.headers.set('X-RapidAPI-Host', 'twelve-data1.p.rapidapi.com')
                               .set('X-RapidAPI-Key', 'f4620064b9mshdb8d1bb25f138ebp15508ajsn932fd197513a');

    return this.http.get('https://twelve-data1.p.rapidapi.com/time_series?symbol=' + Object.values(params) + '&interval=' + time + '&outputsize=100&format=json', {
        headers: this.headers
    });
  }

  getMarketAssetQuote(params: any){
    console.log(params);
    this.headers = this.headers.set('X-RapidAPI-Host', 'twelve-data1.p.rapidapi.com')
                               .set('X-RapidAPI-Key', 'f4620064b9mshdb8d1bb25f138ebp15508ajsn932fd197513a');

    return this.http.get('https://twelve-data1.p.rapidapi.com/quote?symbol=' + params + '&interval=1day&outputsize=1&format=json', {
        headers: this.headers
    });
  }
}
