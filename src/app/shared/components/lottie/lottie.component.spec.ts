import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LottieComponent } from './lottie.component';

describe('LottieComponent', () => {
  let component: LottieComponent;
  let fixture: ComponentFixture<LottieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LottieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LottieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
