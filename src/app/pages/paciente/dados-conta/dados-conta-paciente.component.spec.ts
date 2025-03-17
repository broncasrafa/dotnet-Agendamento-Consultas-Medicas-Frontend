import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosContaPacienteComponent } from './dados-conta-paciente.component';

describe('DadosContaPacienteComponent', () => {
  let component: DadosContaPacienteComponent;
  let fixture: ComponentFixture<DadosContaPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadosContaPacienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DadosContaPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
