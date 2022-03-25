import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogistikComponent } from './logistik.component';

describe('LogistikComponent', () => {
  let component: LogistikComponent;
  let fixture: ComponentFixture<LogistikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogistikComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogistikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
