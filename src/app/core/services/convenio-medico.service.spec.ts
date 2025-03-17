import { TestBed } from '@angular/core/testing';

import { ConvenioMedicoService } from './convenio-medico.service';

describe('ConvenioMedicoService', () => {
  let service: ConvenioMedicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvenioMedicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
