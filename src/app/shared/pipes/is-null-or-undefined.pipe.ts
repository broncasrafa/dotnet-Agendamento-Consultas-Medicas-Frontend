import { Pipe, PipeTransform } from '@angular/core';
import { AppUtils } from 'src/app/core/utils/app.util';

@Pipe({
  name: 'isNullOrUndefined',
  standalone: true
})
export class IsNullOrUndefinedPipe implements PipeTransform {

  transform(value: any): boolean {
    return AppUtils.isNullOrUndefined(value);
  }

}
