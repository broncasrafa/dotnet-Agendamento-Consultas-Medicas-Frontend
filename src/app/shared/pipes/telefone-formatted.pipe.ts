import { Pipe, PipeTransform } from '@angular/core';
import { AppUtils } from 'src/app/core/utils/app.util';

@Pipe({
  name: 'telefoneFormatted',
  standalone: true
})
export class TelefoneFormattedPipe implements PipeTransform {

  transform(phone: string): string | null {
    if (AppUtils.isNullOrEmpty(phone) || phone.length < 10 || phone.length > 11) return null;

    const ddd = phone.substring(0, 2);
    const isCellPhone = phone.length === 11;
    const part1 = phone.substring(2, isCellPhone ? 7 : 6);
    const part2 = phone.substring(isCellPhone ? 7 : 6);

    return `(${ddd}) ${part1}-${part2}`;
  }

}
