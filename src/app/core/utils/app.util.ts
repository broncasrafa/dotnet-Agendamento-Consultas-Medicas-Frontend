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
}
