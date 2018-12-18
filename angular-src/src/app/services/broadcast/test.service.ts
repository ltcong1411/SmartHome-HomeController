import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class TestService {
  // Observable string sources
  private messageSource = new Subject<any>();
  // Observable string streams
  message$ = this.messageSource.asObservable();
  // Service message commands
  emit(message: any) {
    this.messageSource.next(message);
  }

}
