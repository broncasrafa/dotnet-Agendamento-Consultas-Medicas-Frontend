import { Pipe, PipeTransform } from '@angular/core';
import { EspecialistaLocalAtendimentoResponse } from 'src/app/core/models/especialista/response/LocaisAtendimentoResponse';
import { AppUtils } from 'src/app/core/utils/app.util';

@Pipe({
  name: 'addressFormatted',
  standalone: true
})
export class AddressFormattedPipe implements PipeTransform {

  transform(endereco: EspecialistaLocalAtendimentoResponse): string | null {
    if (AppUtils.isNullOrUndefined(endereco) || AppUtils.isNullOrEmpty(endereco.logradouro)) return null;

    return `${endereco.logradouro}, ${!AppUtils.isNullOrEmpty(endereco.complemento) ? ', '+endereco.complemento : ''}${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`
  }

}
