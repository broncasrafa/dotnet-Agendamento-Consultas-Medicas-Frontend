import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MudarSenhaComponent } from './mudar-senha.component';

describe('MudarSenhaComponent', () => {
  let component: MudarSenhaComponent;
  let fixture: ComponentFixture<MudarSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MudarSenhaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MudarSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
