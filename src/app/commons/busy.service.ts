import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {startWith} from 'rxjs/operators';

/**
 * A simple service that emits `true` or `false` depending on its busyness state.
 */
@Injectable()
export class BusyService {
  private readonly subject: Subject<boolean>;
  private readonly observable: Observable<boolean>;

  constructor() {
    this.subject = new ReplaySubject(1);
    this.observable = this.subject.pipe(startWith(false));
  }

  get busyness(): Observable<boolean> {
    return this.observable;
  }

  iamBusy() {
    this.subject.next(true);
  }

  iamFree() {
    this.subject.next(false);
  }
}
