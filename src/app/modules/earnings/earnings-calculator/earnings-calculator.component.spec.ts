import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsCalculatorComponent } from './earnings-calculator.component';

describe('EarningsCalculatorComponent', () => {
  let component: EarningsCalculatorComponent;
  let fixture: ComponentFixture<EarningsCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningsCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningsCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
