import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosEspecialistaListaComponent } from './dados-especialista-lista.component';

describe('DadosEspecialistaListaComponent', () => {
  let component: DadosEspecialistaListaComponent;
  let fixture: ComponentFixture<DadosEspecialistaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadosEspecialistaListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DadosEspecialistaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
