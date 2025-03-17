import { Pipe, PipeTransform } from '@angular/core';
import { AppUtils } from 'src/app/core/utils/app.util';

@Pipe({
  name: 'dateFormatted',
  standalone: true
})
export class DateFormattedPipe implements PipeTransform {

  transform(date: string): string | null {
    if (AppUtils.isNullOrEmpty(date)) return null;

    const [ano, mes, dia] = date.split('T')[0].split('-').map(Number);
    return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;
  }

}
