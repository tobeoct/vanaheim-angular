import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitCamelCase'
})
export class SplitCamelCasePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
   let v = value as string;
    return v.replace(/([A-Z])/g, ' $1')
    .replace(/^./, function(str){ return str.toUpperCase(); })
  }

}
