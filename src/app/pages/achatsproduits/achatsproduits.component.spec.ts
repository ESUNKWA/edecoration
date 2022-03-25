import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchatsproduitsComponent } from './achatsproduits.component';

describe('AchatsproduitsComponent', () => {
  let component: AchatsproduitsComponent;
  let fixture: ComponentFixture<AchatsproduitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AchatsproduitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchatsproduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
