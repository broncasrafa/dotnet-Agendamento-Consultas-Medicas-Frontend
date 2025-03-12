import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarHorariosDisponiveisComponent } from './listar-horarios-disponiveis.component';

describe('ListarHorariosDisponiveisComponent', () => {
  let component: ListarHorariosDisponiveisComponent;
  let fixture: ComponentFixture<ListarHorariosDisponiveisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarHorariosDisponiveisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarHorariosDisponiveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
