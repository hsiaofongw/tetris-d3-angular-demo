import { TestBed } from '@angular/core/testing';

import { TickSource } from './tick-source.service';

describe('TickSourceService', () => {
  let service: TickSource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TickSource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
