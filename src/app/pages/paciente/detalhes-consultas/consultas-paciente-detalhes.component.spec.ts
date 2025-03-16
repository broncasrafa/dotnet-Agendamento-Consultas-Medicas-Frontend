import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasPacienteDetalhesComponent } from './consultas-paciente-detalhes.component';

describe('ConsultasPacienteDetalhesComponent', () => {
  let component: ConsultasPacienteDetalhesComponent;
  let fixture: ComponentFixture<ConsultasPacienteDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultasPacienteDetalhesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultasPacienteDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
