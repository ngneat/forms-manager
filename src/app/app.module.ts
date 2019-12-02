import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoComponent } from './demo/demo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NG_FORMS_MANAGER_CONFIG, NgFormsManagerConfig } from '@ngneat/forms-manager';

@NgModule({
  declarations: [AppComponent, DemoComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [
    // {
    //   provide: NG_FORMS_MANAGER_CONFIG,
    //   useValue: new NgFormsManagerConfig({
    //     storage: {
    //       key: 'Netanel'
    //     }
    //   })
    // }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
