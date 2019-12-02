import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class FormsStore<S> {
  private store: BehaviorSubject<S>;

  constructor(private state: S) {
    this.store = new BehaviorSubject<S>(state);
  }

  select<R>(project: (store: S) => R): Observable<R> {
    return this.store.asObservable().pipe(map(project), distinctUntilChanged());
  }

  getValue(): S {
    return this.store.getValue();
  }

  set(state: S) {
    this.store.next(state);
  }

  update(state: Partial<S>) {
    this.store.next(Object.assign({}, this.getValue(), state));
  }
}
