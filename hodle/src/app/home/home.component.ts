import { Component } from '@angular/core';
import { Point } from '../interfaces/point';
import { PointService } from '../services/point.service';
import { Router } from '@angular/router';
import { AssetService } from '../services/asset.service';
import { MarketService } from '../services/market.service';
import { UserService } from '../services/user.service';
import { WalletService } from '../services/wallet.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  error: undefined | string;
  proSubj = new BehaviorSubject<boolean>(false);
  pro$ = this.proSubj.asObservable();

  dailydata:any[] = [];
  wpoints:Point[][] = [];

  constructor(private ptsvc: PointService, private ursvc: UserService,
              private wtsvc: WalletService, private router:Router,
              private mksvc: MarketService, private atsvc: AssetService){}

  ngOnInit() {
    this.getValuesAndPoints()
    this.pro$.subscribe(
      (res) => {
        if(res === true){
          this.completeExistingPoints();
        }
      }
    )
  }

  getValuesAndPoints(){
    // CERCA TUTTI I WALLET DELL'UTENTE
    this.wtsvc.findByUser().subscribe(
      (resp) => {
        let wallets = resp;
        console.log(wallets);
        // SE NON CI SONO WALLET BLOCCA E VAI A WALLET
        if(wallets.length === 0){
          console.log('User has no wallets');
          this.router.navigate(['/wallet'])
        }else{
          // PER OGNI WALLET (ASSETS HANDLER)
          for (let i = 0; i < wallets.length; i++){
            // CERCA GLI ASSET CONTENUTI
            this.atsvc.findByWalletId(wallets[i].id).subscribe(
                  (resp) => {
                    let assets = resp;
                    console.log(assets);
                    // PER OGNI ASSET
                    for (let a = 0; a < assets.length; a++){
                      // SALTA GLI ASSET CHE CORRISPONDONO ALLA CURRENCY PRINCIPALE
                      if (assets[a].ticker == this.ursvc.getCurrency()){
                        console.log('This is your main currency');
                        if(assets[a].id == assets[assets.length-1].id && wallets[i].id == wallets[wallets.length-1].id){
                          this.proSubj.next(true);
                          console.log(this.pro$);
                        }
                        continue;
                      }else{
                        // SE I VALORI SONO GIA NELL'ARRAY DI DATI ALLORA NON FARE LA CHIAMATA
                        let exist = false;
                        console.log(Object.values(this.dailydata).length);
                        for(let b = 0; b < Object.values(this.dailydata).length; b++){
                          if(this.dailydata[b].meta.symbol == assets[a].ticker){
                            exist = true;
                            console.log('Asset already saved');
                          }
                        }
                        if(!exist){
                          // CERCA IL VALORE DELL'ASSET NEGLI ULTIMI 100 GIORNI
                          this.mksvc.getMarketDailyView(assets[a].ticker, '1day').subscribe(
                            (resp) => {
                              console.log(resp);
                              // INSERISCO L'OGGETTO CONTENENTE I 100 VALORI IN UN ARRAY
                              this.dailydata.push(resp);
                              this.error = undefined;
                              if(assets[a].id == assets[assets.length-1].id && wallets[i].id == wallets[wallets.length-1].id){
                                this.proSubj.next(true);
                                console.log(this.pro$);
                              }
                            },
                            (err) => {
                              console.log(err.error.message);
                              this.error = err.error.message;
                            }
                          )
                        }
                      }
                    }
                    this.error = undefined;
                  },
                  (err) => {
                    console.log(err.error.message);
                    this.error = err.error.message;
                  }
            )
          }
          // PER OGNI WALLET (PONITS HANDLER)
          for (let z = 0; z < wallets.length; z++){
            // CERCA TUTTI I PUNTI LEGATI AL WALLET
            this.ptsvc.findByWallet(wallets[z].id).subscribe(
                (resp) => {
                  console.log(resp)
                  this.wpoints.push(resp);
                  console.log(this.wpoints);
                  this.error = undefined;
                }, (err) => {
                  console.log(err.error.message);
                  this.error = err.error.message;
                }
              )
          }

          this.error = undefined;
        }
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
  }

  completeExistingPoints(){
    console.log(this.dailydata)
    console.log(this.wpoints)

    // PER OGNI ARRAY DI PUNTI
    console.log(this.wpoints.length);
    for(let h = 0; h < this.wpoints.length; h++){
      // PER OGNI PUNTO
      console.log(this.wpoints[h].length);
      console.log(this.wpoints[h]);
      for(let j = 0; j < this.wpoints[h].length; j++){
        const nd = new Date();
        const year = nd.getFullYear();
        const month = String(nd.getMonth() + 1).padStart(2, '0');
        const day = String(nd.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;
        // SE IL PUNTO E DI OGGI PASSA AL PROSSIMO
        console.log(this.wpoints[h][j]);
        if(this.wpoints[h][j].date == today){
          console.log('Today is not completable');
          continue;
        }
        // SE IL PUNTO E INCOMPLETO VA AVANTI
        console.log(this.wpoints[h][j].value);
        if(this.wpoints[h][j].value == undefined || this.wpoints[h][j].value == null){
          let id = this.wpoints[h][j].id;
          let date = this.wpoints[h][j].date;
          let value = 0.00;
          let high = 0.00;
          let low = 0.00;
          // PER OGNI ASSET NEL PUNTO
          console.log(this.wpoints[h][j].assets!.length)
          for(let k = 0; k < this.wpoints[h][j].assets!.length; k++){
            let symbol = this.wpoints[h][j].assets![k].ticker;
            let amount:any = this.wpoints[h][j].assets![k].amount;
            let price:any = this.wpoints[h][j].assets![k].marketValue;
            // SE L'ASSET E UGUALE ALLA CURRENCY PRINCIPALE BLOCCA
            if(symbol == this.ursvc.getCurrency()){
              value = value + price
              high = high + price
              low = low + price
              console.log(value, high, low);
              continue;
            }
            // PER OGNI SERIE DI VALORI PRECEDENTEMENTE SALVATA
            console.log(this.dailydata.length)
            for(let n = 0; n < this.dailydata.length; n++){
              // SE ABBIAMO I SUOI VALORI SALVATI
              console.log(this.dailydata[n].meta);
              if(this.dailydata[n].meta.symbol == symbol){
                // PER OGNI GIORNO
                console.log(this.dailydata[n].values);
                console.log(Object.values(this.dailydata[n].values).length);
                for(let r = 0; r < Object.values(this.dailydata[n].values).length; r++){
                  // SE CE UN GIORNO CORRISPONDENTE
                  console.log(this.dailydata[n].values[r].datetime, date);
                  if(this.dailydata[n].values[r].datetime == date){
                    console.log(amount)
                    console.log( value )
                    value = value + (this.dailydata[n].values[r].close * amount);
                    high =  high + (this.dailydata[n].values[r].high * amount);
                    low =  low + (this.dailydata[n].values[r].low * amount);
                    console.log(value, high, low);
                  }// else{
                    // // SE IL GIORNO E ASSENTE
                    // value = value + price
                    // high = high + price
                    // low = low + price
                  // }
                }
              }

            }
          }
          console.log(value, high, low)
          // this.ptsvc.completePoint(id, value, high, low).subscribe(
          //   (resp) => {
          //     console.log(resp);
          //     this.error = undefined;
          //   },
          //   (err) => {
          //     console.log(err.error.message);
          //     this.error = err.error.message;
          //   }
          // )
        }else{
          console.log('Point already completed');
        }
      }
    }
  }
}
