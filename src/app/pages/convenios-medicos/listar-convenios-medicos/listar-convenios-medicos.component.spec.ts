import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarConveniosMedicosComponent } from './listar-convenios-medicos.component';

describe('ListarConveniosMedicosComponent', () => {
  let component: ListarConveniosMedicosComponent;
  let fixture: ComponentFixture<ListarConveniosMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarConveniosMedicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarConveniosMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
