import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningDragAndDropComponent } from './drag-and-drop.component';

describe('EarningDragAndDropComponent', () => {
  let component: EarningDragAndDropComponent;
  let fixture: ComponentFixture<EarningDragAndDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningDragAndDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningDragAndDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
