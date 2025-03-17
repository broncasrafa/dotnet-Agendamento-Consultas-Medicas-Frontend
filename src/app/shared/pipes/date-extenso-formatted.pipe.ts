import { Pipe, PipeTransform } from '@angular/core';
import { AppUtils } from 'src/app/core/utils/app.util';

@Pipe({
  name: 'dateExtensoFormatted',
  standalone: true
})
export class DateExtensoFormattedPipe implements PipeTransform {

  transform(
    date: string,
    incluirAno: boolean = false,
    capitalizarPrimeiraLetra: boolean = false,
    horario?: string): string | null {
    if (AppUtils.isNullOrEmpty(date)) return null;

    return AppUtils.formatarDataExtenso(date, incluirAno, capitalizarPrimeiraLetra, horario);
  }

}
