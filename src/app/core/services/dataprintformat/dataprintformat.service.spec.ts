import { TestBed } from '@angular/core/testing';

import { DataprintformatService } from './dataprintformat.service';

describe('DataprintformatService', () => {
  let service: DataprintformatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataprintformatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
