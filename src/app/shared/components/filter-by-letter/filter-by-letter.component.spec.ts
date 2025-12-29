import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterByLetterComponent } from './filter-by-letter.component';

describe('FilterByLetterComponent', () => {
  let component: FilterByLetterComponent;
  let fixture: ComponentFixture<FilterByLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterByLetterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterByLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
