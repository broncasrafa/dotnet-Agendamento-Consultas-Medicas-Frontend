import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idadeFormatted',
  standalone: true
})
export class IdadeFormattedPipe implements PipeTransform {

  transform(dataNascimento: string): string {
    if (!dataNascimento) return '';

    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    const diaAtual = hoje.getDate();
    const diaNascimento = nascimento.getDate();

    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--;
    }

    if (idade > 0) {
      return `${idade} ${idade === 1 ? 'ano' : 'anos'}`;
    }

    const diferencaMeses = (hoje.getFullYear() - nascimento.getFullYear()) * 12 + mesAtual - mesNascimento;
    return `${diferencaMeses} ${diferencaMeses === 1 ? 'mês' : 'meses'}`;
  }

}
