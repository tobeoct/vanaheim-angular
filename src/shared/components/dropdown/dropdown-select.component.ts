import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  Input,
  QueryList,
  ViewChild
} from '@angular/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownService } from './dropdown.service';
import { DropdownSelectOptionComponent } from './dropdown-select-option.component';
import { DropdownComponent } from './dropdown.component';

@Component({
  selector: 'custom-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownSelectComponent),
      multi: true
    },
    DropdownService
  ]
})
export class DropdownSelectComponent implements AfterViewInit, ControlValueAccessor {

  @Input()
  public label: string;

  @Input()
  public placeholder: string;

  @Input()
  public selected: string;

  @Input()
  public required = false;

  @Input()
  public disabled = false;

  @Input()
  public controlName:string;

  @ViewChild('input')
  public input: ElementRef;

  @ViewChild(DropdownComponent)
  public dropdown: DropdownComponent;

  @ContentChildren(DropdownSelectOptionComponent)
  public options: QueryList<DropdownSelectOptionComponent>;

  public selectedOption: DropdownSelectOptionComponent;

  public displayText: string;

  public onChangeFn = (_: any) => {};

  public onTouchedFn = () => {};
  

  private keyManager: ActiveDescendantKeyManager<DropdownSelectOptionComponent>;

  constructor(private dropdownService: DropdownService) {
    console.log(this.displayText)
    console.log(this.controlName)
    this.dropdownService.register(this);
   
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.selectedOption = this.options.toArray().find(option => option.key === this.selected)||this.selectedOption;
      this.displayText = this.selectedOption ? this.selectedOption.value : '';
      this.keyManager = new ActiveDescendantKeyManager(this.options)
        .withHorizontalOrientation('ltr')
        .withVerticalOrientation()
        .withWrap();
    });
  }

  public showDropdown() {
    this.dropdown.show();

    if (!this.options.length) {
      return;
    }

    this.selected ? this.keyManager.setActiveItem(this.selectedOption) : this.keyManager.setFirstItemActive();
  }

  public hideDropdown() {
    this.dropdown.hide();
  }

  public onDropMenuIconClick(event: UIEvent) {
    event.stopPropagation();
    setTimeout(() => {
      this.input.nativeElement.focus();
      this.input.nativeElement.click();
    }, 10);
  }

  public onKeyDown(event: KeyboardEvent) {
    if (['Enter', ' ', 'ArrowDown', 'Down', 'ArrowUp', 'Up'].indexOf(event.key) > -1) {
      if (!this.dropdown.showing) {
        this.showDropdown();
        return;
      }

      if (!this.options.length) {
        event.preventDefault();
        return;
      }
    }

    if (event.key === 'Enter' || event.key === ' ') {
      this.selectedOption = this.keyManager.activeItem||this.selectedOption;;
      this.selected = this.selectedOption.key;
      this.displayText = this.selectedOption ? this.selectedOption.value : '';
      this.hideDropdown();
      this.onChange();
    } else if (event.key === 'Escape' || event.key === 'Esc') {
      this.dropdown.showing && this.hideDropdown();
    } else if (['ArrowUp', 'Up', 'ArrowDown', 'Down', 'ArrowRight', 'Right', 'ArrowLeft', 'Left']
      .indexOf(event.key) > -1) {
      this.keyManager.onKeydown(event);
    } else if (event.key === 'PageUp' || event.key === 'PageDown' || event.key === 'Tab') {
      this.dropdown.showing && event.preventDefault();
    }
  }

  public selectOption(option: DropdownSelectOptionComponent) {
    this.keyManager.setActiveItem(option);
    this.selected = option.key;
    this.selectedOption = option;
    this.displayText = this.selectedOption ? this.selectedOption.value : '';
    this.hideDropdown();
    this.input.nativeElement.focus();
    this.onChange();
  }

  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(obj: any): void {
    this.selected = obj;
  }

  public onTouched() {
    this.onTouchedFn();
  }

  public onChange() {
    this.onChangeFn(this.selected);
  }
}