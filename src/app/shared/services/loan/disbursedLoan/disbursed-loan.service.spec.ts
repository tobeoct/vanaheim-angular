import { TestBed } from '@angular/core/testing';

import { DisbursedLoanService } from './disbursed-loan.service';

describe('DisbursedLoanService', () => {
  let service: DisbursedLoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisbursedLoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
