export {};

declare global {
  interface String {
    isNullOrEmpty(): boolean;
    isNullOrWhiteSpace(): boolean;
  }
}

/**
 * Verifica se a string é nula ou vazia.
 */
String.prototype.isNullOrEmpty = function (): boolean {
  return this == null || this.length === 0;
};

/**
 * Verifica se a string é nula, vazia ou contém apenas espaços em branco.
 */
String.prototype.isNullOrWhiteSpace = function (): boolean {
  return this == null || this.trim().length === 0;
};
