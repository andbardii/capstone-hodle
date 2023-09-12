import { Router } from '@angular/router';
import { PointService } from './../services/point.service';
import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { UserService } from '../services/user.service';
import { WalletService } from '../services/wallet.service';
import { MarketService } from '../services/market.service';
import { AssetService } from '../services/asset.service';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule implements OnInit{

  error: undefined | string;

  constructor(private ptsvc:PointService, private ursvc: UserService,
              private wtsvc: WalletService, private router:Router,
              private mksvc: MarketService, private atsvc: AssetService){}

  ngOnInit(): void {

  }

  checkWalletPoints(){
    this.wtsvc.findByUser().subscribe(
      (resp) => {
        let wallets = resp;
        console.log(wallets);
        if(wallets.length == 0){
          this.router.navigate(['/wallet'])
        }
        for (let i = 0; i < wallets.length; i++){

          // this.ptsvc.findByWallet(wallets[i].id).subscribe(
          //   (resp) => {
          //     let points = resp;
          //     console.log(points);
          //     for (let i = 0; i < points.length; i++){
          //       if(points[i].value == null || points[i].value == undefined){
          //         for(let i = 0; i < points[i].assets!.length; i++){

          //         }
          //       }
          //     }
          //     this.error = undefined;
          //   }, (err) => {
          //     console.log(err.error.message);
          //     this.error = err.error.message;
          //   }
          // )
        }
        this.error = undefined;
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
  }
}
