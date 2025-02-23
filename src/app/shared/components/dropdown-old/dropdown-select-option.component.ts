import { Highlightable } from '@angular/cdk/a11y';
import { Component, forwardRef, HostBinding, HostListener, Input } from '@angular/core';
import { DropdownService } from './dropdown.service';
import { DropdownSelectComponent } from './dropdown-select.component';

@Component({
  selector: 'custom-select-option',
  template: '{{value}}',
  styleUrls: ['./select-option.scss']
})
export class DropdownSelectOptionComponent implements Highlightable {

  @Input()
  public key: string;

  @Input()
  public value: string;

  @HostBinding('class.selected')
  public get selected(): boolean {
    return this.select.selectedOption === this;
  }

  @HostBinding('class.active')
  public active = false;

  private select: DropdownSelectComponent;

  constructor(private dropdownService: DropdownService) {
    this.select = this.dropdownService.getSelect();
  }

  public getLabel(): string {
    return this.value;
  }

  public setActiveStyles(): void {
    this.active = true;
  }

  public setInactiveStyles(): void {
    this.active = false;
  }

  @HostListener('click', ['$event'])
  public onClick(event: UIEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.select.selectOption(this);
  }
}