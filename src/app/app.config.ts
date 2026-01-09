// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ReminderComponent } from './components/reminder/reminder.component';
import { TimeService } from './services/time.service';

@NgModule({
  declarations: [
    AppComponent,
    ReminderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [TimeService],
  bootstrap: [AppComponent]
})
export class AppModule { }