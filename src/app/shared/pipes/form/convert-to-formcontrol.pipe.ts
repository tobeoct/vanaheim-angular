import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Pipe({name: 'toControl'})
export class ConvertToFormControlPipe implements PipeTransform {
  transform(value: AbstractControl|null): FormControl {
   if(!value) value = new FormControl('');

 return value as FormControl;
  }
}