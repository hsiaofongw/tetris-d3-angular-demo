import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeC2 implements ShapePrototype {
  public readonly shapeClassId = 'c';
  public readonly shapePrototypeId = 'c2';
  public getShape(): IShape {
    return [
      { offsetX: 1, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 1, offsetY: 2 },
      { offsetX: 0, offsetY: 0 },
    ];
  }
}
