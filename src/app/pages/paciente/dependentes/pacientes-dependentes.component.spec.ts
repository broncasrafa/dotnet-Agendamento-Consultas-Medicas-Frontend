import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesDependentesComponent } from './pacientes-dependentes.component';

describe('PacientesDependentesComponent', () => {
  let component: PacientesDependentesComponent;
  let fixture: ComponentFixture<PacientesDependentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientesDependentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacientesDependentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
