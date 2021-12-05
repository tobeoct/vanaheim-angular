import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'get'
})
export class GetPipe implements PipeTransform {

  transform(value: any[], index: number): any {
    if(!value) return null;
  return value[index];
  }

}
