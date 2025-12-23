import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninAndSignupSuggestionComponent } from './signin-and-signup-suggestion.component';

describe('SigninAndSignupSuggestionComponent', () => {
  let component: SigninAndSignupSuggestionComponent;
  let fixture: ComponentFixture<SigninAndSignupSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninAndSignupSuggestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SigninAndSignupSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
