import { TestBed } from '@angular/core/testing';

import { SintomasEDoencasService } from './sintomas-e-doencas.service';

describe('SintomasEDoencasService', () => {
  let service: SintomasEDoencasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SintomasEDoencasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
