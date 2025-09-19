import { TestBed } from '@angular/core/testing';

import { OpenaiRtcService } from './openai-rtc.service';

describe('OpenaiRtcService', () => {
  let service: OpenaiRtcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenaiRtcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
