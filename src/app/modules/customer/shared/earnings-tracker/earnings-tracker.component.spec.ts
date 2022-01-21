import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsTrackerComponent } from './earnings-tracker.component';

describe('EarningsTrackerComponent', () => {
  let component: EarningsTrackerComponent;
  let fixture: ComponentFixture<EarningsTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningsTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningsTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
