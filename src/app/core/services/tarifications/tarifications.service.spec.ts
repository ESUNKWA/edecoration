import { TestBed } from '@angular/core/testing';

import { TarificationsService } from './tarifications.service';

describe('TarificationsService', () => {
  let service: TarificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
