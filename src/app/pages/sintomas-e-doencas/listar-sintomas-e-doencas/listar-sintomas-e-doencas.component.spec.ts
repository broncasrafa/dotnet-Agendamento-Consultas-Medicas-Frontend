import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSintomasEDoencasComponent } from './listar-sintomas-e-doencas.component';

describe('ListarSintomasEDoencasComponent', () => {
  let component: ListarSintomasEDoencasComponent;
  let fixture: ComponentFixture<ListarSintomasEDoencasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarSintomasEDoencasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarSintomasEDoencasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
