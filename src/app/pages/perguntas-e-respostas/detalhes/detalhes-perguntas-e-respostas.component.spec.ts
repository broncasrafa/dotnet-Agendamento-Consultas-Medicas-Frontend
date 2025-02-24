import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntasERespostasDetalhesComponent } from './detalhes-perguntas-e-respostas.component';

describe('PerguntasERespostasDetalhesComponent', () => {
  let component: PerguntasERespostasDetalhesComponent;
  let fixture: ComponentFixture<PerguntasERespostasDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerguntasERespostasDetalhesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerguntasERespostasDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
