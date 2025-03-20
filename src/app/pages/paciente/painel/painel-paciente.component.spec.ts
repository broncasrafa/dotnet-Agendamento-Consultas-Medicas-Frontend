import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelPacienteComponent } from './painel-paciente.component';

describe('PainelPacienteComponent', () => {
  let component: PainelPacienteComponent;
  let fixture: ComponentFixture<PainelPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelPacienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PainelPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
