import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesSintomasEDoencasComponent } from './detalhes-sintomas-e-doencas.component';

describe('DetalhesSintomasEDoencasComponent', () => {
  let component: DetalhesSintomasEDoencasComponent;
  let fixture: ComponentFixture<DetalhesSintomasEDoencasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesSintomasEDoencasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalhesSintomasEDoencasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
