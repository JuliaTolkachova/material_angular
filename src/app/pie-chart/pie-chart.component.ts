import { Component, OnInit,  AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})

export class PieChartComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;

  heroes: Hero[];
  chart = [];


  chartData = [];
  chartLabels = [];



  constructor(private heroService: HeroService) {
  }


  ngOnInit() {
    this.heroService.getData().subscribe(data =>

      data.forEach(hero => {
          this.chartLabels.push(hero.name);
          this.chartData.push(hero.points);
        }
      ));

    console.log(this.chartData.length);
    console.log(this.chartLabels.length);
    console.log(this.chartData);
    console.log(this.chartLabels);
  }

 ngAfterViewInit() {
    setTimeout(() => {
       this.chart = new Chart('canvas', {
        type: 'pie',
        data: {
           labels: this.chartLabels,
           datasets: [
             {
                data: this.chartData,
                backgroundColor: ['#D8BFD8', '#DDA0DD', '#EE82EE', '#DA70D6', '#FF00FF', '#FF00FF', '#BA55D3', '#9370DB', '#8A2BE2','#9400D3', '#9932CC', '#8B008B', '#800080', '#4B0082', '#6A5ACD', '#483D8B', '#8y8c3h', '#8e9ga2', '#3cb69f', '#e8c9b9', '#c45880']
             }
           ],
        },
         options: {
           responsive: true,
           display: true,
              legend: {
                  display: true

              }
           }
         });

    }, 2000);

 }
}






