import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarProfissionalComponent } from './profissional.component';

describe('RegistrarProfissionalComponent', () => {
  let component: RegistrarProfissionalComponent;
  let fixture: ComponentFixture<RegistrarProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarProfissionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
