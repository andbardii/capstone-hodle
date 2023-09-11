import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MarketService } from '../services/market.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit{

  @ViewChild('f') form!: NgForm;
  error: undefined | string;

  matches:any;

  constructor(private svc: MarketService, private router: Router) {}

  ngOnInit(): void {
  }

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
