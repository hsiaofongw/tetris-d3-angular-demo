import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { Cell } from '../helpers/cell';
import { IBoard, ICell } from '../interfaces';

@Component({
  selector: 'app-grid-display',
  templateUrl: './grid-display.component.html',
  styleUrls: ['./grid-display.component.scss'],
})
export class GridDisplayComponent implements OnInit {
  @ViewChild('svgElementRef', { read: ElementRef })
  _svgElementRef!: ElementRef<SVGElement>;

  @Input()
  nRows = 20;

  @Input()
  nCols = 20;

  @Input()
  cells: ICell[] = [];

  @Output()
  onCellClick = new EventEmitter<Cell>();

  _board: IBoard = { nRows: this.nRows, nCols: this.nCols, cells: this.cells };

  _yPercentageScale = d3.scaleLinear().domain([0, this.nRows]).range([0, 100]);
  _xPercentageScale = d3.scaleLinear().domain([0, this.nCols]).range([0, 100]);

  constructor() {}

  ngOnInit(): void {}

  public update(): void {
    d3.select(this._svgElementRef.nativeElement)
      .selectAll('rect')
      .data(this.cells, function keyFn(datum) { return (datum as Cell).id; })
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('fill', '#BBD0D6')
            .attr('stroke', '#000')
            .attr('x', (d) => `${this._xPercentageScale(d.point.offsetX)}%`)
            .attr('y', (d) => `${this._yPercentageScale(d.point.offsetY)}%`)
            .attr('width', (d) => `${this._xPercentageScale(1)}%`)
            .attr('height', (d) => `${this._yPercentageScale(1)}%`)
            .on('click', (_, d) => this.onCellClick.emit(d as Cell)),
        (update) =>
          update
            .transition()
            .duration(150)
            .attr('x', (d) => `${this._xPercentageScale(d.point.offsetX)}%`)
            .attr('y', (d) => `${this._yPercentageScale(d.point.offsetY)}%`),
        (exit) => exit.transition().duration(150).style('opacity','0').remove()
      );
  }
}
