import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { reverseAuthGuard } from './reverse-auth-guard';

describe('reverseAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => reverseAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
