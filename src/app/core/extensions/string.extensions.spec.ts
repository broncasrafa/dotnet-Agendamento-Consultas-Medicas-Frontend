import { StringExtensions } from './string.extensions';

describe('StringExtensions', () => {
  it('deve retornar true para null em isNullOrEmpty', () => {
    expect(StringExtensions.isNullOrEmpty(null)).toBe(true);
  });

  it('deve retornar true para undefined em isNullOrEmpty', () => {
    expect(StringExtensions.isNullOrEmpty(undefined)).toBe(true);
  });

  it('deve retornar true para string vazia em isNullOrEmpty', () => {
    expect(StringExtensions.isNullOrEmpty('')).toBe(true);
  });

  it('deve retornar false para string não vazia em isNullOrEmpty', () => {
    expect(StringExtensions.isNullOrEmpty('Angular')).toBe(false);
  });

  it('deve retornar true para espaços em branco em isNullOrWhiteSpace', () => {
    expect(StringExtensions.isNullOrWhiteSpace('   ')).toBe(true);
  });

  it('deve retornar false para string com caracteres visíveis em isNullOrWhiteSpace', () => {
    expect(StringExtensions.isNullOrWhiteSpace(' TypeScript ')).toBe(false);
  });
});
