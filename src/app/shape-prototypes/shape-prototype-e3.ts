import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeE3 implements ShapePrototype {
  public readonly shapeClassId = 'e';
  public readonly shapePrototypeId = 'e3';
  public getShape(): IShape {
    return [
      { offsetX: 2, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 1, offsetY: 0 },
    ];
  }
}
