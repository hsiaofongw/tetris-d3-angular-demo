import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Board, Cell } from '../interfaces';

@Component({
  selector: 'app-grid-display',
  templateUrl: './grid-display.component.html',
  styleUrls: ['./grid-display.component.scss']
})
export class GridDisplayComponent implements OnInit {

  @ViewChild('svgElementRef', { read: ElementRef }) _svgElementRef!: ElementRef<SVGElement>;

  @Input()
  nRows = 20;

  @Input()
  nCols = 20;

  @Input()
  cells: Cell[] = [];

  _board: Board = { nRows: this.nRows, nCols: this.nCols, cells: this.cells };

  _yPercentageScale = d3.scaleLinear().domain([0, this.nRows]).range([0, 100]);
  _xPercentageScale = d3.scaleLinear().domain([0, this.nCols]).range([0, 100]);

  constructor() { }

  ngOnInit(): void {
  }

  public update(): void {
    d3.select(this._svgElementRef.nativeElement)
      .selectAll('rect')
      .data(this.cells)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('fill', '#BBD0D6')
            .attr('stroke', '#000')
            .attr('x', (d) => `${this._xPercentageScale(d.point.offsetX)}%`)
            .attr('y', (d) => `${this._yPercentageScale(d.point.offsetY)}%`)
            .attr('width', (d) => `${this._xPercentageScale(1)}%`)
            .attr('height', (d) => `${this._yPercentageScale(1)}%`),
        (update) =>
          update
            .attr('x', (d) => `${this._xPercentageScale(d.point.offsetX)}%`)
            .attr('y', (d) => `${this._yPercentageScale(d.point.offsetY)}%`),
        (exit) => exit.remove()
    );
  }

}
