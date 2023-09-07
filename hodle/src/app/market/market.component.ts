import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MarketService } from '../services/market.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent {

  @ViewChild('f') form!: NgForm;
  error: undefined | string;

  matches:any;

  constructor(private svc: MarketService) {}

  onSubmit() {
    if(this.form.value.keywords.trim() !== ''){
      this.svc.searchAsset(this.form.value).subscribe((data) => {
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

}
