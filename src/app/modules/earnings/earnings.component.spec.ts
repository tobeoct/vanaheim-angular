import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsFlowComponent } from './earnings.component';

describe('EarningsFlowComponent', () => {
  let component: EarningsFlowComponent;
  let fixture: ComponentFixture<EarningsFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningsFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningsFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
