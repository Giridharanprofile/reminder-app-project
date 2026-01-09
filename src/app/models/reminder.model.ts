// src/app/models/reminder.model.ts
export interface Reminder {
  id: number;
  text: string;
  time: Date;
  isCompleted: boolean;
}