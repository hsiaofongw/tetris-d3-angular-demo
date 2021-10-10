import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { Board } from '../helpers/board';
import { Cell } from '../helpers/cell';
import { IBoard, ICell } from '../interfaces';
import { ViewUpdateHook, VIEW_UPDATE_HOOKS } from '../update-hooks/types';

@Component({
  selector: 'app-grid-display',
  templateUrl: './grid-display.component.html',
  styleUrls: ['./grid-display.component.scss'],
})
export class GridDisplayComponent implements OnInit {
  @ViewChild('svgElementRef', { read: ElementRef })
  _svgElementRef!: ElementRef<SVGElement>;

  @Output()
  onCellClick = new EventEmitter<Cell>();

  @Input()
  board?: Board;

  constructor(
    @Inject(VIEW_UPDATE_HOOKS) private updateHooks: ViewUpdateHook[]
  ) {}

  ngOnInit(): void {}

  public update(): void {
    if (!this.board) {
      return;
    }

    const board = this.board;

    const _yPercentageScale = d3
      .scaleLinear()
      .domain([0, this.board.nRows])
      .range([0, 100]);
    const _xPercentageScale = d3
      .scaleLinear()
      .domain([0, this.board.nCols])
      .range([0, 100]);

    this.updateHooks.forEach((updateHook) =>
      updateHook.triggerWithUpdate({
        updateType: 'viewUpdate',
        payload: board,
      })
    );

    d3.select(this._svgElementRef.nativeElement)
      .selectAll('rect')
      .data(board.cells, function keyFn(datum) {
        return (datum as Cell).id;
      })
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('fill', '#BBD0D6')
            .attr('stroke', '#000')
            .attr('x', (d) => `${_xPercentageScale(d.point.offsetX)}%`)
            .attr('y', (d) => `${_yPercentageScale(d.point.offsetY)}%`)
            .attr('width', (d) => `${_xPercentageScale(1)}%`)
            .attr('height', (d) => `${_yPercentageScale(1)}%`)
            .on('click', (_, d) => this.onCellClick.emit(d as Cell)),
        (update) =>
          update
            .transition()
            .duration(150)
            .attr('x', (d) => `${_xPercentageScale(d.point.offsetX)}%`)
            .attr('y', (d) => `${_yPercentageScale(d.point.offsetY)}%`),
        (exit) => exit.transition().duration(150).style('opacity', '0').remove()
      );
  }
}
