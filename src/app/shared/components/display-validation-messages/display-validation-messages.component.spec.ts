import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayValidationMessagesComponent } from './display-validation-messages.component';

describe('DisplayValidationMessagesComponent', () => {
  let component: DisplayValidationMessagesComponent;
  let fixture: ComponentFixture<DisplayValidationMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayValidationMessagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayValidationMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
