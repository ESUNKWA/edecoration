import { TestBed } from '@angular/core/testing';

import { VenteproduitsService } from './venteproduits.service';

describe('VenteproduitsService', () => {
  let service: VenteproduitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenteproduitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
