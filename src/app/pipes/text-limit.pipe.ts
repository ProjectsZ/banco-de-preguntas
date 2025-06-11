import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textLimit',
  standalone: true
})
export class TextLimitPipe implements PipeTransform {

  transform(value: string | undefined, maxLength: number = 25, additionalText: string = '...'): string {
    if(!value) return '';

    return value.length > maxLength ? value.slice(0, maxLength) + additionalText : value;
  }

}
