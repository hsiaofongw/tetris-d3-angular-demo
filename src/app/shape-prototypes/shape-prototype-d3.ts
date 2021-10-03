import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeD3 implements ShapePrototype {
  public readonly shapeClassId = 'd';
  public readonly shapePrototypeId = 'd3';
  public getShape(): IShape {
    return [
      { offsetX: 2, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
    ];
  }
}
