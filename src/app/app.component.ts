import { Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';

type NameCount = { name: string; count: number };

type Point = { offsetX: number; offsetY: number };
type Block = {
  id: number;
  offsetX: number;
  offsetY: number;
  data: Array<Point>;
};

type BoundingBox = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  nCols = 20;
  nRows = 20;
  colPercentage = (1 / this.nCols) * 100;
  rowPercentage = (1 / this.nRows) * 100;

  @ViewChild('svgElement', { read: ElementRef })
  svgElementRef!: ElementRef<HTMLElement>;

  _data: Block[] = [];

  getRandomBlockData(): Block['data'] {
    const candidateBlockDatas: Array<Block['data']> = [
      [
        { offsetX: 0, offsetY: 0 },
        { offsetX: 1, offsetY: 0 },
        { offsetX: 2, offsetY: 0 },
        { offsetX: 3, offsetY: 0 },
      ],
      [
        { offsetX: 0, offsetY: 0 },
        { offsetX: 1, offsetY: 0 },
        { offsetX: 0, offsetY: 1 },
        { offsetX: 1, offsetY: 1 },
      ],
    ];

    const nCandidates = candidateBlockDatas.length;
    const choose = d3.randomInt(0, nCandidates);
    return candidateBlockDatas[choose()];
  }

  getBoundingBoxFromBlockData(blockData: Block['data']): BoundingBox {
    const xOffsets = blockData.map((point) => point.offsetX);
    const yOffsets = blockData.map((point) => point.offsetY);
    const minX = Math.min(...xOffsets);
    const maxX = Math.max(...xOffsets);
    const minY = Math.min(...yOffsets);
    const maxY = Math.min(...yOffsets);
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }

  addNew(): void {
    const randomBlockData = this.getRandomBlockData();
    const blockId = this._data.length;
    const blockWidth = this.getBoundingBoxFromBlockData(randomBlockData).width;
    const maximumAllowXOffset = this.nCols - blockWidth;
    const blockOffsetX = d3.randomInt(0, maximumAllowXOffset + 1)();

    randomBlockData.forEach((point) => {
      point.offsetX = point.offsetX + blockOffsetX;
    });

    this._data.push({
      id: blockId,
      offsetX: blockOffsetX,
      offsetY: 0,
      data: randomBlockData,
    });

    d3.select(this.svgElementRef.nativeElement)
      .selectAll('g')
      .data(this._data)
      .enter()
      .append('g')
      .attr('id', (d) => d.id)
      .selectAll('rect')
      .data((d) => d.data)
      .enter()
      .append('rect')
      .attr('width', `${this.colPercentage}%`)
      .attr('height', `${this.rowPercentage}%`)
      .attr('offsetX', (d) => d.offsetX)
      .attr('offsetY', (d) => d.offsetY)
      .attr('x', (d) => `${d.offsetX * this.colPercentage}%`)
      .attr('y', (d) => `${d.offsetY * this.rowPercentage}%`)
      .attr('stroke', '#000')
      .attr('fill', '#FFF');
  }
}
