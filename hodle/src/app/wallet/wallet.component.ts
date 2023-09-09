import { AssetService } from './../services/asset.service';
import { MarketService } from './../services/market.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { NgForm } from '@angular/forms';
import { Wallet } from '../interfaces/wallet';
import { Asset } from '../interfaces/asset';
import { Movement } from '../interfaces/movement';
import { MovementService } from '../services/movement.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  @ViewChild('f') form!: NgForm;
  @ViewChild('s') sform!: NgForm;
  @ViewChild('a') aform!: NgForm;
  @ViewChild('m') mform!: NgForm;
  error: undefined | string;

  wallets: Wallet[] = [];
  needwallet: boolean = false;
  postwallet: boolean = false;

  windex: number = 0;
  postasset: boolean = false;
  postmove: boolean = false;
  matches: any;

  movement: boolean = false;
  mov: Movement = {};
  movs: Movement[] = [];

  asset: Asset = {};
  assets: Asset[] = [];;

  constructor(private asvc: AssetService, private msvc: MarketService,
              private svc: WalletService, private mosvc: MovementService){}

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
            this.form.reset();
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
            this.sform.reset();
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
                  this.aform.reset();
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
        this.findAssetsByWalletId();
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
      this.findAssetsByWalletId();
    }
  }

  move(){
    if(this.windex == this.wallets.length-1){
      return;
    }else{
      this.windex = this.windex + 1;
      this.findAssetsByWalletId();
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

  findAssetsByWalletId(){
    this.asvc.findByWalletId(this.wallets[this.windex].id).subscribe(
      (resp) => {
        this.assets = resp;
        console.log(this.assets);
        this.error = undefined;
        this.updatePrice();
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
  }

  onMovementSubmit() {

  }

  async updatePrice() {
    for (let i = 0; i < this.assets.length; i++) {
      this.msvc.getMarketAssetQuote(this.assets[i].ticker).subscribe(
        (resp) => {
          console.log(resp);
          this.error = undefined;
          this.asvc.updateMarketPrice(this.assets[i].id,Object.values(resp)[0]['05. price']).subscribe(
            (resp) => {
              console.log(resp);
              this.error = undefined;
            }, (err) => {
              console.log(err.error.message);
              this.error = err.error.message;
            }
          )
        }, (err) => {
          console.log(err.error.message);
          this.error = err.error.message;
        }
      )
      if (i < this.assets.length - 1) {
        await this.delay(15000);
      }
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
