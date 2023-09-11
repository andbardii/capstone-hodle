import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarketService } from 'src/app/services/market.service';
import { Chart, registerables } from 'chart.js';
import { formatDate } from '@angular/common';
import { Currencyoptions } from 'src/app/enumerated/currencyoptions';
Chart.register(...registerables)

@Component({
  selector: 'app-marketview',
  templateUrl: './marketview.component.html',
  styleUrls: ['./marketview.component.scss']
})
export class MarketviewComponent implements OnInit{

  currency!: string;

  asset:any;
  values:any;

  labels:any;
  datas:any;
  high:any;
  low:any;

  yesterday:string = '';

  constructor(private usvc: UserService, private svc: MarketService, private route:ActivatedRoute){}

  ngOnInit(): void {
    this.getMarketDailyData();
    this.currency = this.usvc.getCurrency();
  }

  getMarketDailyData(){
    this.route.params
    .subscribe((params:any)=>{
      console.log(params)
      this.svc.getMarketDailyView(params).subscribe(
          (data) => {
          console.log(Object.values(data)[0])
          this.asset = Object.values(data)[0]
          this.values = Object.values(data)[1];
          this.getData();
          },
          (err) => {
          console.log(err.error.message);
      })
    })
  }

  getMarketIntradayData(interval: number){
    this.route.params
    .subscribe((params:any)=>{
      console.log(params)
      this.svc.getMarketIntradayView(params, interval).subscribe(
          (data) => {
          console.log(data)
          this.getData();
          },
          (err) => {
          console.log(err.error.message);
      })
    })
  }

  renderChart(){
    const chart = new Chart("assetchart", {
      data: {
        datasets: [
        {
          type: 'line',
          label: 'low',
          data: this.low,
          borderColor: '#FF0100',
          tension: 0.1
        },
        {
          type: 'line',
          label: 'price',
          data: this.datas,
          borderColor: '#cccccc',
          tension: 0.1
        },
        {
          type: 'line',
          label: 'high',
          data: this.high,
          borderColor: '#167a4c',
          tension: 0.1
        }],
      labels: this.labels
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }


  getData(){

    const labelsd = [];
    const datasd = [];
    const highd = [];
    const lowd = [];

    for (const key in this.values) {
      labelsd.push(key);
      datasd.push(this.values[key]['4. close']);
      highd.push(this.values[key]['2. high']);
      lowd.push(this.values[key]['3. low']);
    }
    this.yesterday = labelsd[0];
    this.low = lowd.reverse();
    this.high = highd.reverse();
    this.labels = labelsd.reverse();
    this.datas = datasd.reverse();
    this.renderChart();
  }

}
