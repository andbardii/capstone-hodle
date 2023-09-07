import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarketService } from 'src/app/services/market.service';

@Component({
  selector: 'app-marketview',
  templateUrl: './marketview.component.html',
  styleUrls: ['./marketview.component.scss']
})
export class MarketviewComponent implements OnInit{

  asset:any;
  values:any;

  constructor(private svc: MarketService, private route:ActivatedRoute){}

  ngOnInit(): void {
    this.getChartData()
  }

  getChartData(){
    this.route.params
  .subscribe((params:any)=>{
      console.log(params)
      this.svc.getMarketDailyView(params).subscribe(
          (data) => {
          console.log(Object.values(data)[0])
          console.log(Object.values(data)[1])

          this.asset = Object.values(data)[0];
          this.values = Object.values(data)[1];
          },
          (err) => {
          console.log(err.error.message);
      })
    })
  }
}
