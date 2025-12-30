import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesConveniosMedicosComponent } from './detalhes-convenios-medicos.component';

describe('DetalhesConveniosMedicosComponent', () => {
  let component: DetalhesConveniosMedicosComponent;
  let fixture: ComponentFixture<DetalhesConveniosMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesConveniosMedicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalhesConveniosMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
