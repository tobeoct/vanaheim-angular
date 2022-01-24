import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningStatusComponent } from './earning-status.component';

describe('EarningStatusComponent', () => {
  let component: EarningStatusComponent;
  let fixture: ComponentFixture<EarningStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
