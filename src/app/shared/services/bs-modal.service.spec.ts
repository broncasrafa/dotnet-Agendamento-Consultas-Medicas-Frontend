import { TestBed } from '@angular/core/testing';

import { BsModalService } from './bs-modal.service';

describe('BsModalService', () => {
  let service: BsModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BsModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
