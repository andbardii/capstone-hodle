import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketRoutingModule } from './market-routing.module';
import { MarketComponent } from './market.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MarketviewComponent } from './marketview/marketview.component';


@NgModule({
  declarations: [
    MarketComponent,
    MarketviewComponent
  ],
  imports: [
    CommonModule,
    MarketRoutingModule,
    HttpClientModule,
    FormsModule
  ]
})
export class MarketModule { }
