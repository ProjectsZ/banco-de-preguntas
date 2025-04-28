import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textHighlight',
  standalone: true
})
export class TextHighlightPipe implements PipeTransform {

  transform(value: string, className: string, tagName: string = 'span'): string {
    if (!value) return '';

    return value.replace(/\*\*(.*?)\*\*/g, `<${tagName} class="${className}">$1</${tagName}>`);
  }

}
