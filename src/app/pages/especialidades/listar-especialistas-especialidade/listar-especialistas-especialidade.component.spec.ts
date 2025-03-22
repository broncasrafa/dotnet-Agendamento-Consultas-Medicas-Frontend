import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEspecialistasEspecialidadeComponent } from './listar-especialistas-especialidade.component';

describe('ListarEspecialistasEspecialidadeComponent', () => {
  let component: ListarEspecialistasEspecialidadeComponent;
  let fixture: ComponentFixture<ListarEspecialistasEspecialidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarEspecialistasEspecialidadeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarEspecialistasEspecialidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
