import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOldComponent } from './modal.component';

describe('ModalOldComponent', () => {
  let component: ModalOldComponent;
  let fixture: ComponentFixture<ModalOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalOldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
