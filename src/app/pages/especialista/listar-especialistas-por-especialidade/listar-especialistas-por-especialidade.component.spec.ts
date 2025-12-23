import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEspecialistasPorEspecialidadeComponent } from './listar-especialistas-por-especialidade.component';

describe('ListarEspecialistasPorEspecialidadeComponent', () => {
  let component: ListarEspecialistasPorEspecialidadeComponent;
  let fixture: ComponentFixture<ListarEspecialistasPorEspecialidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarEspecialistasPorEspecialidadeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarEspecialistasPorEspecialidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
