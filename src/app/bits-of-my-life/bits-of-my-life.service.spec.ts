import { TestBed } from '@angular/core/testing';

import { BitsOfMyLifeService } from './bits-of-my-life.service';

describe('BitsOfMyLifeService', () => {
  let service: BitsOfMyLifeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitsOfMyLifeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
