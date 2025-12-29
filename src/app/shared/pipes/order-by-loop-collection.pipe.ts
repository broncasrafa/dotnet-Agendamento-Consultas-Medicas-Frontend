import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  standalone: true
})
export class OrderByLoopCollectionPipe implements PipeTransform {

  transform<T>(value: T[], property: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    if (!value || !property) return value;

    return [...value].sort((a: any, b: any) => {
      const x = (a[property] ?? '').toString().toLowerCase();
      const y = (b[property] ?? '').toString().toLowerCase();

      if (x < y) return direction === 'asc' ? -1 : 1;
      if (x > y) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

}
