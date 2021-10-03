import { Component, Inject, OnInit } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype, SHAPE_PROTOTYPES } from '../shape-prototypes/shape-prototype';

type Group<T> = { id: string, children: T[] };

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  _shapeGroups: Group<IShape>[] = [];

  constructor(@Inject(SHAPE_PROTOTYPES) private shapePrototypes: ShapePrototype[]) { }

  ngOnInit(): void {
    const shapeRecords: Record<string, IShape[]> = {};
    for (const shapeProto of this.shapePrototypes) {
      if (shapeRecords[shapeProto.shapeClassId] === undefined) {
        shapeRecords[shapeProto.shapeClassId] = [];
      }

      shapeRecords[shapeProto.shapeClassId].push(shapeProto.getShape());
    }

    for (const groupId in shapeRecords) {
      this._shapeGroups.push({ id: groupId, children: shapeRecords[groupId]});
    }
  }

}
