import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSimpleModalComponent } from './generic-simple-modal.component';

describe('GenericSimpleModalComponent', () => {
  let component: GenericSimpleModalComponent;
  let fixture: ComponentFixture<GenericSimpleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericSimpleModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericSimpleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
