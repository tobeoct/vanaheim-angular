import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDragAndDropComponent } from './drag-and-drop.component';

describe('LoanDragAndDropComponent', () => {
  let component: LoanDragAndDropComponent;
  let fixture: ComponentFixture<LoanDragAndDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanDragAndDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDragAndDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
