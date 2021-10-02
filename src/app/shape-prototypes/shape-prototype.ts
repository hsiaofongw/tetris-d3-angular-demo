import { Shape } from '../interfaces';

export abstract class ShapePrototype {
  abstract shapeClassId: string;
  abstract shapePrototypeId: string;
  abstract getShape(): Shape;
}
