import { TestBed } from '@angular/core/testing';

import { PerguntasRespostasService } from './perguntas-respostas.service';

describe('PerguntasRespostasService', () => {
  let service: PerguntasRespostasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerguntasRespostasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
