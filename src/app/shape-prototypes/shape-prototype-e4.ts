import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeE4 implements ShapePrototype {
  public readonly shapeClassId = 'e';
  public readonly shapePrototypeId = 'e4';
  public getShape(): IShape {
    return [
      { offsetX: 0, offsetY: 2 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
    ];
  }
}
