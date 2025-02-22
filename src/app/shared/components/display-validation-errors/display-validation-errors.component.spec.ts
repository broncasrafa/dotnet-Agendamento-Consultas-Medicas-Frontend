import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayValidationErrorsComponent } from './display-validation-errors.component';

describe('DisplayValidationErrorsComponent', () => {
  let component: DisplayValidationErrorsComponent;
  let fixture: ComponentFixture<DisplayValidationErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayValidationErrorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayValidationErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
