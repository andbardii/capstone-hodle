import { AssetService } from './../services/asset.service';
import { MarketService } from './../services/market.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { NgForm } from '@angular/forms';
import { Wallet } from '../interfaces/wallet';
import { Asset } from '../interfaces/asset';
import { Movement } from '../interfaces/movement';
import { MovementService } from '../services/movement.service';
import { UserService } from '../services/user.service';
import { Assettype } from '../enumerated/assettype';
import { Assetclass } from '../enumerated/assetclass';
import { Wallettype } from '../enumerated/wallettype';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {


  @ViewChild('f') form!: NgForm;
  @ViewChild('s') sform!: NgForm;
  @ViewChild('a') aform!: NgForm;
  @ViewChild('c') cform!: NgForm;
  @ViewChild('cc') ccform!: NgForm;

  @ViewChild('mi') miform!: NgForm;
  @ViewChild('mo') moform!: NgForm;
  @ViewChild('mt') mtform!: NgForm;
  @ViewChild('mc') mcform!: NgForm;
  error: undefined | string;

  currency!: string;

  wallets: Wallet[] = [];
  needwallet: boolean = false;
  postwallet: boolean = false;

  windex: number = 0;
  postasset: boolean = false;
  maincurrency: boolean = false;
  depositcurr: boolean = false;
  convertcurr: boolean = false;
  postmove: boolean = false;
  matches: any;

  movement: boolean = false;
  mov: Movement = {};
  movs: Movement[] = [];
  incoming: boolean = false;
  outgoing: boolean = false;
  transfer: boolean = false;
  convert: boolean = false;
  aexist: boolean = false;

  asset: Asset = {};
  assets: Asset[] = [];

  constructor(private asvc: AssetService, private msvc: MarketService,
              private svc: WalletService, private movsvc: MovementService,
              private usvc: UserService){}

  ngOnInit(): void {
    this.currency = this.usvc.getCurrency();
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

  depositMainCurrency() {
    this.asvc.addAsset(this.cform.value).subscribe(
      (resp) => {
        console.log(resp);
        this.error = undefined;
        this.closeCurrencyZone();
        this.maincurrency = false;
        this.findByUser();
        this.cform.reset();
        this.asset = {};
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    );
  }

  convertToMainCurrency() {
    this.movsvc.addConvert(this.ccform.value, this.wallets[this.windex].id, this.asset).subscribe(
      (resp) => {
        console.log(resp);
        this.error = undefined;
        this.closeCurrencyZone();
        this.maincurrency = false;
        this.findByUser();
        this.ccform.reset();
        this.asset = {};
        this.mov = {};
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
  }

  addMain() {
    this.maincurrency = true;
    this.asset.name = this.currency;
    this.asset.ticker = this.currency;
    this.asset.marketPrice = 1.00;
    this.asset.assetType = Assettype.FIAT;
    this.asset.assetClass = Assetclass.FIAT;
    this.asset.tax = 0.00;
    this.asset.paidCommission = 0.00;
    this.asset.averagePurchasePrice = 1.00;
    this.asset.walletId = this.wallets[this.windex].id;
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
        this.getMovements();
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
      this.getMovements();
    }
  }

  move(){
    if(this.windex == this.wallets.length-1){
      return;
    }else{
      this.windex = this.windex + 1;
      this.findAssetsByWalletId();
      this.getMovements();
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

  findUpdatedAssets(){
    this.asvc.findByWalletId(this.wallets[this.windex].id).subscribe(
      (resp) => {
        this.assets = resp;
        this.svc.findByUser().subscribe(
          (resp) => {
            this.wallets = resp;
            this.error = undefined;
          }, (err) => {
            console.log(err.error.message);
            this.error = err.error.message;
          }
        );
        console.log(this.assets);
        this.error = undefined;
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
  }

  getMovements(){
    this.movsvc.getMovsByWallet(this.wallets[this.windex].id).subscribe(
      (resp) => {
        this.movs = resp;
        console.log(this.movs);
        this.error = undefined;
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
  }

  onIncomingMovement() {
    this.movsvc.addIncoming(this.miform.value, this.wallets[this.windex].id).subscribe(
      (resp) => {
        console.log(resp);
        this.error = undefined;
        this.closeMovZone();
        this.movement = false;
        this.getMovements();
        this.findUpdatedAssets();
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
  }

  onOutgoingMovement() {
    this.movsvc.addOutgoing(this.moform.value, this.wallets[this.windex].id).subscribe(
      (resp) => {
        console.log(resp);
        this.error = undefined;
        this.movement = false;
        this.closeMovZone();
        this.movement = false;
        this.getMovements();
        this.findUpdatedAssets();
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
  }

  onTransferMovement() {
    this.movsvc.addTransfer(this.mtform.value, this.wallets[this.windex].id).subscribe(
      (resp) => {
        console.log(resp);
        this.error = undefined;
        this.movement = false;
        this.closeMovZone();
        this.movement = false;
        this.getMovements();
        this.findUpdatedAssets();
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
  }

  onConvertMovement() {
    this.movsvc.addConvert(this.mcform.value, this.wallets[this.windex].id, this.asset).subscribe(
      (resp) => {
        console.log(resp);
        this.closeMovZone();
        this.getMovements();
        this.movement = false;
        this.findUpdatedAssets();
        this.aexist = false;
        this.mcform.reset();
        this.asset = {};
      }, (err) => {
        console.log(err.error.message);
      }
    )
  }

  selectAsset(id: any) {
    this.mov.startingAssetId = id;
    console.log(this.mov.startingAssetId)
  }

  checkAsset(a:any) {
    for(let i = 0; i < this.assets.length; i++){
      if (this.assets[i].ticker == a['1. symbol']) {
        this.aexist = true;
        this.asset.ticker = a['1. symbol'];
      }else{
        this.asset.ticker = a['1. symbol'];
        this.asset.name = a['2. name'];
        this.msvc.getMarketAssetQuote(a['1. symbol']).subscribe(
          (resp) => {
            console.log(resp);
            this.error = undefined;
            this.asset.marketPrice = Object.values(resp)[0]['05. price'];
          }, (err) => {
            console.log(err.error.message);
            this.error = err.error.message;
          }
        )
      }
    }
  }

  async updatePrice() {
    for (let i = 0; i < this.assets.length; i++) {
      if(this.assets[i].ticker == this.currency){
        console.log("no update is needed")
      }else{
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
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  closeMovZone(){
    if(this.incoming == true || this.outgoing == true ||
       this.transfer == true || this.convert == true){
        this.incoming = false;
        this.outgoing = false;
        this.transfer = false;
        this.convert = false;
       }else{
        this.movement = false;
       }
  }

  closeCurrencyZone() {
    if(this.depositcurr == true || this.convertcurr == true){
      this.depositcurr = false;
      this.convertcurr = false;
      }else{
       this.maincurrency = false;
      }
  }


}
