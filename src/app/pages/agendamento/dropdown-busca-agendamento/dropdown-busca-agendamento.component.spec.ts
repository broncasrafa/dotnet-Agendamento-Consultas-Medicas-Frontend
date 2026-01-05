import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownBuscaAgendamentoComponent } from './dropdown-busca-agendamento.component';

describe('DropdownBuscaAgendamentoComponent', () => {
  let component: DropdownBuscaAgendamentoComponent;
  let fixture: ComponentFixture<DropdownBuscaAgendamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownBuscaAgendamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropdownBuscaAgendamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
