import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesDependentesDetalhesComponent } from './pacientes-dependentes-detalhes.component';

describe('PacientesDependentesDetalhesComponent', () => {
  let component: PacientesDependentesDetalhesComponent;
  let fixture: ComponentFixture<PacientesDependentesDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientesDependentesDetalhesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacientesDependentesDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
