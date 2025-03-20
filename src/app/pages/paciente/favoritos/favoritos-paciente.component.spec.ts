import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritosPacienteComponent } from './favoritos-paciente.component';

describe('FavoritosPacienteComponent', () => {
  let component: FavoritosPacienteComponent;
  let fixture: ComponentFixture<FavoritosPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritosPacienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoritosPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
