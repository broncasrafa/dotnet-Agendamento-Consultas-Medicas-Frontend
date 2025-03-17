import { Pipe, PipeTransform } from '@angular/core';
import { AppUtils } from 'src/app/core/utils/app.util';

@Pipe({
  name: 'cpfFormatted',
  standalone: true
})
export class CpfFormattedPipe implements PipeTransform {

  transform(cpf: string): string | null {
    if (AppUtils.isNullOrEmpty(cpf)) return null;

    const cpfStr = cpf.toString().padStart(11, '0'); // Garante 11 dígitos
    return cpfStr.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

}
