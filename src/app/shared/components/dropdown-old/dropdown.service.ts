import { Injectable } from '@angular/core';
import { DropdownSelectComponent } from './dropdown-select.component';

@Injectable()
export class DropdownService {

  private select: DropdownSelectComponent;

  public register(select: DropdownSelectComponent) {
    this.select = select;
  }

  public getSelect(): DropdownSelectComponent {
    return this.select;
  }
}