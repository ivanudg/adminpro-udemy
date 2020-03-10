import { Component, OnInit, Input } from '@angular/core';
import { MultiDataSet, Label } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: []
})
export class GraficoDonaComponent implements OnInit {

  // Doughnut
  @Input() ChartLabels: Label[] = [];
  @Input() ChartData: MultiDataSet = [];
  @Input() ChartType: ChartType;

  constructor() { }

  ngOnInit() {
  }

}
