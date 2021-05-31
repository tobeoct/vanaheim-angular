import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Pipe({name: 'toGroup'})
export class ConvertToFormGroupPipe implements PipeTransform {
  transform(value: AbstractControl|null): FormGroup {
   if(!value) value = new FormGroup({});

 return value as FormGroup;
  }
}