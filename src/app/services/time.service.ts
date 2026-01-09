// src/app/services/time.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private fastModeSubject = new BehaviorSubject<boolean>(false);
  private currentTimeSubject = new BehaviorSubject<Date>(new Date());
  
  public fastMode$: Observable<boolean> = this.fastModeSubject.asObservable();
  public currentTime$: Observable<Date> = this.currentTimeSubject.asObservable();

  constructor() {
    this.startClock();
  }

  private startClock(): void {
    interval(1000).subscribe(() => {
      const isFastMode = this.fastModeSubject.value;
      const currentTime = this.currentTimeSubject.value;
      
      if (isFastMode) {
        // In fast mode, add 1 minute per second
        currentTime.setMinutes(currentTime.getMinutes() + 1);
      } else {
        // Normal mode, add 1 second
        currentTime.setSeconds(currentTime.getSeconds() + 1);
      }
      
      this.currentTimeSubject.next(new Date(currentTime));
    });
  }

  toggleFastMode(): void {
    this.fastModeSubject.next(!this.fastModeSubject.value);
  }

  getCurrentTime(): Date {
    return this.currentTimeSubject.value;
  }

  resetToRealTime(): void {
    this.currentTimeSubject.next(new Date());
    this.fastModeSubject.next(false);
  }
}