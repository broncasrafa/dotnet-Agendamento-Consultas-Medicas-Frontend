import { AddressFormattedPipe } from './address-formatted.pipe';

describe('AddressFormattedPipe', () => {
  it('create an instance', () => {
    const pipe = new AddressFormattedPipe();
    expect(pipe).toBeTruthy();
  });
});
