import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntasERespostasComponent } from './perguntas-e-respostas.component';

describe('PerguntasERespostasComponent', () => {
  let component: PerguntasERespostasComponent;
  let fixture: ComponentFixture<PerguntasERespostasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerguntasERespostasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerguntasERespostasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
