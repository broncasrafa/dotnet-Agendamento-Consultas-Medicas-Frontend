import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentoBuscaComponent } from './agendamento-busca.component';

describe('AgendamentoBuscaComponent', () => {
  let component: AgendamentoBuscaComponent;
  let fixture: ComponentFixture<AgendamentoBuscaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentoBuscaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgendamentoBuscaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
