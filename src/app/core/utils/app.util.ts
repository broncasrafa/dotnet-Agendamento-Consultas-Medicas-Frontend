import { HttpErrorResponse } from "@angular/common/http";

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
}
