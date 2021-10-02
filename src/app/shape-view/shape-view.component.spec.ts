import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeViewComponent } from './shape-view.component';

describe('ShapeViewComponent', () => {
  let component: ShapeViewComponent;
  let fixture: ComponentFixture<ShapeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShapeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
