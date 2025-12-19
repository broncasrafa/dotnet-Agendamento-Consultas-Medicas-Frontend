import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownPesquisarEspecialidadesComponent } from './dropdown-pesquisar-especialidades.component';

describe('DropdownPesquisarEspecialidadesComponent', () => {
  let component: DropdownPesquisarEspecialidadesComponent;
  let fixture: ComponentFixture<DropdownPesquisarEspecialidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownPesquisarEspecialidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownPesquisarEspecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
