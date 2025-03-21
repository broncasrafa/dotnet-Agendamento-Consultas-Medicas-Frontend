import { Pipe, PipeTransform } from '@angular/core';
import { AppUtils } from 'src/app/core/utils/app.util';


@Pipe({
  name: 'numberThousandsFormatted',
  standalone: true
})
export class NumberThousandsFormattedPipe implements PipeTransform {

  transform(value: any): string {
    return AppUtils.numberThousandsFormatter(value);
  }

}
