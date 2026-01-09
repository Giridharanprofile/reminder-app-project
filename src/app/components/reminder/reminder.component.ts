// src/app/components/reminder/reminder.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Reminder } from '../../models/reminder.model';
import { TimeService } from '../../services/time.service';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit, OnDestroy {
  reminders: Reminder[] = [];
  newReminderText: string = '';
  currentTime: Date = new Date();
  fastMode: boolean = false;
  showAddForm: boolean = false;
  selectedTime: string = '';
  
  private destroy$ = new Subject<void>();
  private nextId: number = 1;

  constructor(private timeService: TimeService) {}

  ngOnInit(): void {
    // Subscribe to current time updates
    this.timeService.currentTime$
      .pipe(takeUntil(this.destroy$))
      .subscribe(time => {
        this.currentTime = time;
        this.checkReminders();
      });

    // Subscribe to fast mode changes
    this.timeService.fastMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(fastMode => {
        this.fastMode = fastMode;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFastMode(): void {
    this.timeService.toggleFastMode();
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.newReminderText = '';
      this.selectedTime = '';
    }
  }

  addReminder(): void {
    if (this.newReminderText.trim() && this.selectedTime) {
      const reminderTime = new Date(this.selectedTime);
      
      const newReminder: Reminder = {
        id: this.nextId++,
        text: this.newReminderText.trim(),
        time: reminderTime,
        isCompleted: false
      };

      this.reminders.push(newReminder);
      this.reminders.sort((a, b) => a.time.getTime() - b.time.getTime());
      
      this.newReminderText = '';
      this.selectedTime = '';
      this.showAddForm = false;
    }
  }

  deleteReminder(id: number): void {
    this.reminders = this.reminders.filter(r => r.id !== id);
  }

  private checkReminders(): void {
    this.reminders.forEach(reminder => {
      if (!reminder.isCompleted && this.currentTime >= reminder.time) {
        reminder.isCompleted = true;
      }
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }
}