import { TestBed } from '@angular/core/testing';

import { LogistikService } from './logistik.service';

describe('LogistikService', () => {
  let service: LogistikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogistikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
