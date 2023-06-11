import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * The App Event interface.
 */
export interface IAppEvent {
  name: string;
  data?: any;
}

/**
 * Provides a simple event broadcast and subscription facility.
 */
@Injectable({
  providedIn: 'root'
})
export class AppEventService {
  private eventBus: Subject<IAppEvent>;

  constructor() {
    this.eventBus = new Subject<IAppEvent>();
  }

  /**
   * Broadcast an event.
   *
   * @param name the event's name.
   * @param data (Optional) data or payload for the event.
   */
  public broadcast(name: string, data?: any) {
    this.eventBus.next({name, data});
  }

  /**
   * Subscribe to an event with the given name.
   * Please remember to unsubscribe from the observable once done to avoid leaks.
   *
   * @param name The event name to subscribe to.
   */
  public subscribe<T>(name: string): Observable<T> {
    return this.eventBus.asObservable()
      .pipe(
        filter(event => event.name === name),
        map(event => <T>event.data)
      );
  }
}
