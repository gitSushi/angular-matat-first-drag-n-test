import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatIconModule} from '@angular/material/icon';

import { AppComponent } from './app.component';
import { WordComponent } from './word.component';

@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [AppComponent, WordComponent],
  exports: [AppComponent],
})
export class AppModule {}
