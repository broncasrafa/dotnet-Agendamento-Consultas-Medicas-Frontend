export class StringExtensions {
  /**
   * Verifica se uma string é nula, indefinida ou vazia.
   */
  static isNullOrEmpty(value: string | null | undefined): boolean {
    return value === null || value === undefined || value.length === 0;
  }

  /**
   * Verifica se uma string é nula, indefinida, vazia ou contém apenas espaços em branco.
   */
  static isNullOrWhiteSpace(value: string | null | undefined): boolean {
    return value === null || value === undefined || value.trim().length === 0;
  }
}

// Adicionando métodos diretamente na classe String para chamar como String.isNullOrEmpty()
declare global {
  interface StringConstructor {
    isNullOrEmpty(value: string | null | undefined): boolean;
    isNullOrWhiteSpace(value: string | null | undefined): boolean;
  }
}

String.isNullOrEmpty = StringExtensions.isNullOrEmpty;
String.isNullOrWhiteSpace = StringExtensions.isNullOrWhiteSpace;
