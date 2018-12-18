import { TestBed, inject } from '@angular/core/testing';

import { MessageEventService } from './message-event.service';

describe('MessageEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageEventService]
    });
  });

  it('should ...', inject([MessageEventService], (service: MessageEventService) => {
    expect(service).toBeTruthy();
  }));
});
