import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisarEspecialistaStepperComponent } from './pesquisar-especialista-stepper.component';

describe('PesquisarEspecialistaStepperComponent', () => {
  let component: PesquisarEspecialistaStepperComponent;
  let fixture: ComponentFixture<PesquisarEspecialistaStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesquisarEspecialistaStepperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PesquisarEspecialistaStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
