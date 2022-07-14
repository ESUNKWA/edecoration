import { TestBed } from '@angular/core/testing';

import { CryptDataService } from './crypt-data.service';

describe('CryptDataService', () => {
  let service: CryptDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
