import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFazerPerguntaComponent } from './form-fazer-pergunta.component';

describe('FormFazerPerguntaComponent', () => {
  let component: FormFazerPerguntaComponent;
  let fixture: ComponentFixture<FormFazerPerguntaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFazerPerguntaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormFazerPerguntaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
