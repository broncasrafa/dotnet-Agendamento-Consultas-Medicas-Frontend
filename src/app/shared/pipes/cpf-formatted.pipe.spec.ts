import { CpfFormattedPipe } from './cpf-formatted.pipe';

describe('CpfFormattedPipe', () => {
  it('create an instance', () => {
    const pipe = new CpfFormattedPipe();
    expect(pipe).toBeTruthy();
  });
});
