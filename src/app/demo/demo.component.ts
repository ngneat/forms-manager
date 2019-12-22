import { Component, OnInit } from '@angular/core';
import { NgFormsManager } from '@ngneat/forms-manager';
import { map, tap } from 'rxjs/operators';

@Component({
  template: `
    <div class="container mt">
      <div class="row">
        <div class="col-3">
          <div class="nav flex-column nav-pills">
            <a
              class="nav-link"
              routerLink="one"
              routerLinkActive="active"
              [ngStyle]="stepOneInvalid$ | async"
              >Step One</a
            >
            <a
              class="nav-link"
              routerLink="two"
              [ngStyle]="stepTwoInvalid$ | async"
              routerLinkActive="active"
              >Step Two</a
            >
          </div>
        </div>
        <div class="col-9">
          <div class="tab-content">
            <router-outlet></router-outlet>
          </div>
          <button class="btn btn-info" (click)="save()">Save</button>
        </div>
      </div>
    </div>
  `,
})
export class DemoComponent implements OnInit {
  stepOneInvalid$ = this.manager
    .validityChanges('stepOne')
    .pipe(map(valid => (valid ? null : { background: 'red' })));
  stepTwoInvalid$ = this.manager
    .validityChanges('stepTwo')
    .pipe(map(valid => (valid ? null : { background: 'red' })));

  constructor(private manager: NgFormsManager<AppForms>) {}

  ngOnInit() {}

  save() {
    if (this.manager.isValid('stepOne') && this.manager.isValid('stepTwo')) {
      console.log('valid');
    }
  }
}
