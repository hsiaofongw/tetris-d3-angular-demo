import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeC1 implements ShapePrototype {
  public readonly shapeClassId = 'c';
  public readonly shapePrototypeId = 'c1';
  public getShape(): IShape {
    return [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 2, offsetY: 0 },
      { offsetX: 0, offsetY: 1 },
    ];
  }
}
