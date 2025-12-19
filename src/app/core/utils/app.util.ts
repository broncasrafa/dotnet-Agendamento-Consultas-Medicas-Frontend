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
   * Converter data json 'yyyy-MM-dd' para locale date 'dd/MM/yyyy'
   * @param dateJson data no formato "yyyy-MM-dd"
   * @returns a data formatada por extenso
   */
  public static convertDateToLocaleDate(dateJson: string) {
    const [ano, mes, dia] = dateJson.split('T')[0].split('-').map(Number);
    const dataFormatada = new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR');
    return dataFormatada;
  }

  /**
   * Formatar por extenso a data
   * @param dataString data no formato "yyyy-MM-dd"
   * @param incluirAno flag para incluir ano. default true
   * @param capitalizarPrimeiraLetra flag para capitalizar a primeira letra do dia da semana. default true
   * @param incluirHorario valor do horario da data
   * @returns a data formatada por extenso
   */
  public static formatarDataExtenso(
    dataString: string,
    incluirAno: boolean = true,
    capitalizarPrimeiraLetra: boolean = true,
    incluirHorario?: string): string {

      if (this.isNullOrEmpty(dataString)) return '';

      const date = dataString.split('T')[0];
      const [ano, mes, dia] = date.split('-').map(Number);
      const data = new Date(ano, mes - 1, dia); // Mês começa do 0 no JS

      let options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      };

      if (incluirAno) {
        options.year = 'numeric';
      }

      let dataFormatada = data.toLocaleDateString('pt-BR', options);

      if (capitalizarPrimeiraLetra) {
        dataFormatada = dataFormatada.replace(/^\w/, (c) => c.toUpperCase());
      }

      // Se houver um horário, adiciona ao final
      if (incluirHorario) {
        dataFormatada += ` às ${incluirHorario}`;
      }

      return dataFormatada;
  }

  /**
   * Remove acentos e transforma em minúsculas para uma busca mais precisa.
   */
  public static normalizarTexto(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  /**
   * Retorna um número especificado de elementos contíguos desde o início de uma sequência.
   * @param lista A sequência de onde retornar elementos.
   * @param count O número de elementos a serem retornados.
   * @returns Um T[] lista que contém o número especificado de elementos desde o início da origem.
   */
  public static take<T>(lista: T[], count: number): T[] {
    if (this.isNullOrUndefined(lista))
      return [];

    return lista.slice(0, count);
  }

  /**
   * Ignora um número especificado de elementos em uma sequência e retorna os elementos restantes.
   * @param lista A sequência de onde retornar elementos.
   * @param count O número de elementos a serem ignorados antes de retornar os elementos restantes.
   * @returns Um T[] que contém elementos que ocorrem após o índice especificado na sequência de entrada.
   */
  public static skip<T>(lista: T[], count: number): T[] {
    if (this.isNullOrUndefined(lista)) return [];
    if (count < 1) return [];
    if (count >= lista.length) return lista;

    return lista.slice(count);
  }

  /**
   * Ordenar uma lista informando o campo para a ordenação e a direção (ascendente ou descendente)
   * @param lista lista de objetos
   * @param campoCriterio campo para a ordenação
   * @param sortOrder ordem de ordenação ('asc' para crescente, 'desc' para decrescente)
   * @returns a lista ordenada conforme o critério e a direção especificada
   */
  public static orderBy<T>(lista: T[], campoCriterio: keyof T, sortOrder: string = 'asc'): T[] {
    const order = sortOrder.toLowerCase();

    if (order !== 'asc' && order !== 'desc') {
      throw new Error("O parâmetro 'sortOrder' deve ser 'asc' ou 'desc'.");
    }

    return [...lista].sort((a, b) => {
      if (a[campoCriterio] > b[campoCriterio]) return order === 'asc' ? 1 : -1;
      if (a[campoCriterio] < b[campoCriterio]) return order === 'asc' ? -1 : 1;
      return 0;
    });
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

  /**
   * Ordenar uma lista de forma crescente informando o campo para a ordenação
   * @param lista lista de objetos
   * @param campoCriterio campo para a ordenação
   * @returns a lista ordenada de forma crescente
   */
  public static orderByAscending<T>(lista: T[], campoCriterio: keyof T): T[] {
    return [...lista].sort((a, b) => (a[campoCriterio] > b[campoCriterio] ? 1 : -1));
  }


  /**
   * Remover um item da lista pelo id
   * @param lista lista de objetos
   * @param removeId id para remover da lista
   */
  public static removerItemNaListaById(lista: any[], removeId: number) {
    const index = lista.findIndex(item => item.id === removeId);
    if (index !== -1) {
      lista.splice(index, 1);
    }
  }


  /**
   * Atualizar o objeto na lista pelo id
   * @param lista lista de objetos
   * @param id id do objeto para atualizar
   * @param novosDados novos dados do objeto
   */
  public static atualizarItemNaListaById(lista: any[], id: number, novosDados: Partial<any>) {
    const item = lista.find(c => c.id === id);
    if (item) {
      Object.assign(item, novosDados);
    }
  }

  /**
   * Formatar o número para números com pontuações
   * @param num o (number) valor a ser formatado
   * @returns número formatado com pontuações
   */
  public static numberThousandsFormatter(num: any) {
    if (!num || num === undefined) return "0";

    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /**
   * Formatar o número para números com abreviações
   * @param num o (number) valor a ser formatado
   * @returns números com abreviações
   */
  public static numberFormatter(num: any) {
    if (num >= 1000000000) {
      return (num/1000000000).toFixed(1).replace(/\.0$/,'') + 'G';
    }

    if (num >= 1000000) {
      return (num/1000000).toFixed(1).replace(/\.0$/,'') + 'M';
    }

    if (num >= 1000) {
      return (num/1000).toFixed(1).replace(/\.0$/,'') + 'K';
    }

    return num;
  }
}
