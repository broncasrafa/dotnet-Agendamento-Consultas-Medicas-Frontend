import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCidadesAtendidasConveniosMedicosComponent } from './listar-cidades-atendidas-convenios-medicos.component';

describe('ListarCidadesAtendidasConveniosMedicosComponent', () => {
  let component: ListarCidadesAtendidasConveniosMedicosComponent;
  let fixture: ComponentFixture<ListarCidadesAtendidasConveniosMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarCidadesAtendidasConveniosMedicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarCidadesAtendidasConveniosMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
