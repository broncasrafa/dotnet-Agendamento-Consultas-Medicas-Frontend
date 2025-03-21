import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesEspecialistaComponent } from './detalhes-especialista.component';

describe('DetalhesEspecialistaComponent', () => {
  let component: DetalhesEspecialistaComponent;
  let fixture: ComponentFixture<DetalhesEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesEspecialistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalhesEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
