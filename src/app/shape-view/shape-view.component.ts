import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IShape } from '../interfaces';
import * as d3 from 'd3';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shape-view',
  templateUrl: './shape-view.component.html',
  styleUrls: ['./shape-view.component.scss'],
})
export class ShapeViewComponent {
  @ViewChild('svgElementRef', { read: ElementRef })
  svgElementRef?: ElementRef<SVGElement>;

  @Input()
  cellSizePx = 15;

  @Input()
  cellLabelFontSize = 12;

  @Input()
  shape!: IShape;

  _height = 0;
  _width = 0;

  constructor() {}

  ngOnChanges(): void {
    this._calcSize();
    this._renderShape();
  }

  _calcSize(): void {
    if (!!this.shape) {
      const heightExtent = d3.extent(this.shape, (p) => p.offsetY) as [
        number,
        number
      ];
      this._height = heightExtent[1] - heightExtent[0] + 1;

      const widthExtent = d3.extent(this.shape, (p) => p.offsetX) as [
        number,
        number
      ];
      this._width = widthExtent[1] - widthExtent[0] + 1;
    }
  }

  _getSvgElementRef(): Observable<ElementRef<SVGElement>> {
    return new Observable<ElementRef<SVGElement>>((observer) => {
      const tryGetElementRef = () => {
        if (this.svgElementRef !== undefined) {
          observer.next(this.svgElementRef);
          observer.complete();
          return;
        }

        window.setTimeout(() => tryGetElementRef(), 0);
      };

      tryGetElementRef();
    });
  }

  _renderShape(): void {
    if (!!this.shape) {
      this._getSvgElementRef().subscribe((svgElementRef) => {
        if (svgElementRef.nativeElement) {
          this._updateD3(svgElementRef);
        }
      });
    }
  }

  _updateD3(svgElementRef: ElementRef<SVGElement>) {
    const selection = d3
      .select(svgElementRef.nativeElement)
      .selectAll('g')
      .data(this.shape)
      .join((enter) => enter.append('g'));

    selection
      .append('rect')
      .attr('x', (d) => d.offsetX * this.cellSizePx)
      .attr('y', (d) => d.offsetY * this.cellSizePx)
      .attr('fill-opacity', (_) => '0')
      .attr('stroke', (_) => '#000')
      .attr('width', `${this.cellSizePx}`)
      .attr('height', `${this.cellSizePx}`);

    selection
      .append('text')
      .attr('x', (d) => d.offsetX * this.cellSizePx + this.cellSizePx / 2)
      .attr('y', (d) => d.offsetY * this.cellSizePx + this.cellSizePx / 2)
      .attr('dy', `${this.cellLabelFontSize/2}`)
      .attr('font-size', `${this.cellLabelFontSize}`)
      .attr('text-anchor', 'middle')
      .text((d, i) => `${i+1}`);
  }
}
