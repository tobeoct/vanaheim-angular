import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaseperated'
})
export class CommaseperatedPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return null;
  }

}
