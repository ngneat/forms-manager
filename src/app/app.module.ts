import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { DemoComponent } from './demo/demo.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepOneComponent } from './step-one/step-one.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, DemoComponent, StepTwoComponent, StepOneComponent],
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
