import { IsNullOrUndefinedPipe } from './is-null-or-undefined.pipe';

describe('IsNullOrUndefinedPipe', () => {
  it('create an instance', () => {
    const pipe = new IsNullOrUndefinedPipe();
    expect(pipe).toBeTruthy();
  });
});
