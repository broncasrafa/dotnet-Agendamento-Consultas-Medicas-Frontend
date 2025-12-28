import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncontreUmMedicoComponent } from './encontre-um-medico.component';

describe('EncontreUmMedicoComponent', () => {
  let component: EncontreUmMedicoComponent;
  let fixture: ComponentFixture<EncontreUmMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncontreUmMedicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EncontreUmMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
