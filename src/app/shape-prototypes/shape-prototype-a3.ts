import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeA3 implements ShapePrototype {
  public readonly shapeClassId = 'a';
  public readonly shapePrototypeId = 'a3';
  public getShape(): IShape {
    return [
      { offsetX: 3, offsetY: 2 },
      { offsetX: 2, offsetY: 2 },
      { offsetX: 1, offsetY: 2 },
      { offsetX: 0, offsetY: 2 },
    ];
  }
}
