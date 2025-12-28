import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultResponseEmptyComponent } from './result-response-empty.component';

describe('ResultResponseEmptyComponent', () => {
  let component: ResultResponseEmptyComponent;
  let fixture: ComponentFixture<ResultResponseEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultResponseEmptyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultResponseEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
