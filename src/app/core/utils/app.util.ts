import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup, FormGroupDirective } from "@angular/forms";

export class AppUtils {

  /**
   * Trata os erros de requisição HTTP.
   * @param err Erro retornado pela requisição.
   * @returns { title: string, errorMessage: string } Mensagem de erro tratada.
   */
  public static handleHttpError(err: HttpErrorResponse): { title: string, errorMessage: string } {
    const title = err?.error?.title || 'Erro desconhecido';
    const errorMessage = err?.error?.errors?.join(', ') || 'Ocorreu um erro ao tentar processar sua requisição.';

    return { title, errorMessage };
  }

  /**
   * Converter data no formato ddMMyyyy para yyyy-MM-dd.
   * @param dateStr data no formato ddMMyyyy.
   * @returns data no formato yyyy-MM-dd.
   */
  public static convertToDateFormat(dateStr: string): string {
    if (!/^\d{8}$/.test(dateStr)) {
      throw new Error('Formato inválido. Use ddMMyyyy.');
    }

    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = dateStr.substring(4, 8);

    return `${year}-${month}-${day}`; // Formato yyyy-MM-dd para enviar à API
  }

  /**
   * Limpar formulário.
   * @param formDirective
   * @param form
   */
  public static resetForm(formDirective: FormGroupDirective, form: FormGroup) {
    formDirective.resetForm(); // Reseta o estado do formulário
    form.reset(); // Reseta os valores do formulário
  }

  /**
   * Verificar se o objeto esta null ou undefined
   * @param obj objeto
   * @returns true se for null ou undefined
   */
  public static isNullOrUndefined<T>(obj: T | null | undefined): boolean {
    return obj === null || obj === undefined;
  }

  /**
   * Verificar se o objeto esta null ou vazio
   * @param obj objeto
   * @returns true se for null ou vazio
   */
  public static isNullOrEmpty(obj: string | null | undefined): boolean {
    return obj === null || obj === undefined || obj.trim().length === 0;
  }

  /**
   * Formatar por extenso a data
   * @param dataString data no formato "yyyy-MM-dd"
   * @returns a data formatada por extenso
   */
  public static formatarDataExtenso(dataString: string): string {
    const [ano, mes, dia] = dataString.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia); // Mês começa do 0 no JS

    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).replace(/^\w/, (c) => c.toUpperCase());
  }

  /**
   * Remove acentos e transforma em minúsculas para uma busca mais precisa.
   */
  public static normalizarTexto(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  /**
   * Ordenar uma lista de forma decrescente informando o campo para a ordenação
   * @param lista lista de objetos
   * @param campoCriterio campo para a ordenação
   * @returns a lista ordenada de forma decrescente
   */
  public static orderByDescending<T>(lista: T[], campoCriterio: keyof T): T[] {
    return [...lista].sort((a, b) => (b[campoCriterio] > a[campoCriterio] ? 1 : -1));
  }
}
