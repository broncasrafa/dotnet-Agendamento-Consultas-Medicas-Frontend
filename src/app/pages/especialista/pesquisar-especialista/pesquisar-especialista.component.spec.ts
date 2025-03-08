import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisarEspecialistaComponent } from './pesquisar-especialista.component';

describe('PesquisarEspecialistaComponent', () => {
  let component: PesquisarEspecialistaComponent;
  let fixture: ComponentFixture<PesquisarEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesquisarEspecialistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PesquisarEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
