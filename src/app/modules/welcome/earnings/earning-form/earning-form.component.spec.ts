import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningFormComponent } from './earning-form.component';

describe('EarningFormComponent', () => {
  let component: EarningFormComponent;
  let fixture: ComponentFixture<EarningFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
