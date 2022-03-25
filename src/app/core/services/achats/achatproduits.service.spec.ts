import { TestBed } from '@angular/core/testing';

import { AchatproduitsService } from './achatproduits.service';

describe('AchatproduitsService', () => {
  let service: AchatproduitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AchatproduitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
