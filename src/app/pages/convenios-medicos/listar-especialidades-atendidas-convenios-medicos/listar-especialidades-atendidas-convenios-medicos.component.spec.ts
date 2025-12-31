import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEspecialidadesAtendidasConveniosMedicosComponent } from './listar-especialidades-atendidas-convenios-medicos.component';

describe('ListarEspecialidadesAtendidasConveniosMedicosComponent', () => {
  let component: ListarEspecialidadesAtendidasConveniosMedicosComponent;
  let fixture: ComponentFixture<ListarEspecialidadesAtendidasConveniosMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarEspecialidadesAtendidasConveniosMedicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarEspecialidadesAtendidasConveniosMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
