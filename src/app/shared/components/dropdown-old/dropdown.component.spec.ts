import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownOldComponent } from './dropdown.component';

describe('DropdownOldComponent', () => {
  let component: DropdownOldComponent;
  let fixture: ComponentFixture<DropdownOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownOldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
