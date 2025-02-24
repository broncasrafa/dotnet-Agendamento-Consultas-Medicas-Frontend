import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntasERespostasListarComponent } from './listar/listar-perguntas-e-respostas.component';

describe('PerguntasERespostasListarComponent', () => {
  let component: PerguntasERespostasListarComponent;
  let fixture: ComponentFixture<PerguntasERespostasListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerguntasERespostasListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerguntasERespostasListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
