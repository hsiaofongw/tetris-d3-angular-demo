import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeC3 implements ShapePrototype {
  public readonly shapeClassId = 'c';
  public readonly shapePrototypeId = 'c3';
  public getShape(): IShape {
    return [
      { offsetX: 2, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 2, offsetY: 0 },
    ];
  }
}
