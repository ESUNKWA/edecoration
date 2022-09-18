import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteproduitsComponent } from './venteproduits.component';

describe('VenteproduitsComponent', () => {
  let component: VenteproduitsComponent;
  let fixture: ComponentFixture<VenteproduitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenteproduitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteproduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
