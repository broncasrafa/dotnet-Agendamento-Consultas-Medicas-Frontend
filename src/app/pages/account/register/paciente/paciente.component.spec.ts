import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPacienteComponent } from './paciente.component';

describe('PacienteComponent', () => {
  let component: RegistrarPacienteComponent;
  let fixture: ComponentFixture<RegistrarPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
