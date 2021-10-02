import { InjectionToken } from '@angular/core';
import { Shape } from '../interfaces';

export abstract class ShapePrototype {
  abstract shapeClassId: string;
  abstract shapePrototypeId: string;
  abstract getShape(): Shape;
}

export const SHAPE_PROTOTYPES = new InjectionToken<ShapePrototype[]>(
  'ShapePrototypes'
);
