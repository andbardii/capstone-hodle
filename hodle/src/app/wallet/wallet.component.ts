import { AssetService } from './../services/asset.service';
import { MarketService } from './../services/market.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { NgForm } from '@angular/forms';
import { Wallet } from '../interfaces/wallet';
import { Asset } from '../interfaces/asset';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  @ViewChild('f') form!: NgForm;
  @ViewChild('s') sform!: NgForm;
  @ViewChild('a') aform!: NgForm;
  error: undefined | string;

  wallets: Wallet[] = [];
  needwallet: boolean = false;
  postwallet: boolean = false;

  windex: number = 0;
  postasset: boolean = false;
  postmove: boolean = false;
  matches: any;

  asset: Asset = {};

  constructor(private asvc: AssetService, private msvc: MarketService, private svc: WalletService){}

  ngOnInit(): void {
    this.findByUser();
  }

  onSubmit() {
    console.log(this.form.value.type)
    if(  this.form.value.type.trim() !== '') {
        this.svc.addWallet(this.form.value).subscribe(
          (resp) => {
            console.log(resp);
            this.error = undefined;
            this.needwallet = false;
            this.postwallet = false;
            this.findByUser();
          }, (err) => {
            console.log(err.error.message);
            this.error = err.error.message;
          }
        );
    } else {
      this.error = 'Field Required';
    }
  }

  onSearch() {
    if(this.sform.value.keywords.trim() !== ''){
      this.msvc.searchAsset(this.sform.value).subscribe((data) => {
            console.log(Object.values(data)[0]);
            this.matches = Object.values(data)[0];
            this.error = undefined;
      },
      (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      });
      this.error = undefined;
    } else {
      this.error = 'Field Required';
    }
  }

  onSubmitAsset() {
          this.asvc.addAsset(this.aform.value).subscribe(
                (resp) => {
                  console.log(resp);
                  this.error = undefined;
                  this.postasset = false;
                  this.findByUser();
                }, (err) => {
                  console.log(err.error.message);
                  this.error = err.error.message;
                }
              );
  }

  findByUser(){
    this.svc.findByUser().subscribe(
      (resp) => {
        this.wallets = resp;
        console.log(this.wallets);
        if(this.wallets.length == 0){
          this.needwallet = true;
        }
        this.error = undefined;
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    );
  }

  back(){
    if(this.windex == 0 ){
      return;
    }else{
      this.windex = this.windex - 1;
    }
  }

  move(){
    if(this.windex == this.wallets.length-1){
      return;
    }else{
      this.windex = this.windex + 1;
    }
  }

  chooseNewAsset(asset:any){
    this.msvc.getMarketAssetQuote(asset['1. symbol']).subscribe(
      (resp) => {
        console.log(resp);
        this.error = undefined;
        this.asset.marketPrice = Object.values(resp)[0]['05. price'];
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
    this.matches.splice(0, this.matches.length);
    this.matches.push(asset);
    this.asset.name = asset['2. name']
    this.asset.ticker = asset['1. symbol']
    this.asset.walletId = this.wallets[this.windex].id
  }
}
