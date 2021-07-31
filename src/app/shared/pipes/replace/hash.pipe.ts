import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'hash' })
export class HashPipe implements PipeTransform {
  transform(value: string | null, startIndex: number, count: number): string | null {
    if (!value) return value;
    if (!value || !startIndex || !count) {
      return value;
    }
    let strToReplace = value.substring(startIndex, startIndex + count);
    return value.replace(new RegExp(strToReplace, 'g'), "*".repeat(count));
  }
}