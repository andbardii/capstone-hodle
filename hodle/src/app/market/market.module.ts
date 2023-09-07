import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketRoutingModule } from './market-routing.module';
import { MarketComponent } from './market.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MarketComponent
  ],
  imports: [
    CommonModule,
    MarketRoutingModule,
    HttpClientModule,
    FormsModule
  ]
})
export class MarketModule { }
