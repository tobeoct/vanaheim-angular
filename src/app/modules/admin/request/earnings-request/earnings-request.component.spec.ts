import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsRequestComponent } from './earnings-request.component';

describe('EarningsRequestComponent', () => {
  let component: EarningsRequestComponent;
  let fixture: ComponentFixture<EarningsRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningsRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningsRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
