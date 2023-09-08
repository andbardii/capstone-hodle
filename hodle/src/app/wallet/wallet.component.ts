import { Component, ViewChild } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent {

  @ViewChild('f') form!: NgForm;
  error: undefined | string;

  constructor(private svc: WalletService){}

  onSubmit() {
    console.log(this.form.value.type)
    if(  this.form.value.type.trim() !== '') {
        this.svc.addWallet(this.form.value).subscribe(
          (resp) => {
            console.log(resp);
            this.error = undefined;
          }, (err) => {
            console.log(err.error.message);
            this.error = err.error.message;
          }
        );
    } else {
      this.error = 'Field Required';
    }
  }


}
