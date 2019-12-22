import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgFormsManager } from '@ngneat/forms-manager';

@Component({
  template: `
    <form [formGroup]="stepOne">
      <div class="form-group">
        <label for="exampleFormControlInput1">Email address</label>
        <input
          type="email"
          class="form-control"
          id="exampleFormControlInput1"
          formControlName="email"
          placeholder="name@example.com"
        />
      </div>
      <div class="form-group">
        <label for="exampleFormControlSelect1">Example select</label>
        <select class="form-control" id="exampleFormControlSelect1" formControlName="select">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <div class="form-group">
        <label for="exampleFormControlSelect2">Example multiple select</label>
        <select
          multiple
          class="form-control"
          id="exampleFormControlSelect2"
          formControlName="multiSelect"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <div class="form-group">
        <label for="exampleFormControlTextarea1">Example textarea</label>
        <textarea
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          formControlName="textarea"
        ></textarea>
      </div>
      <code>Value: {{ stepOne.value | json }}</code>
    </form>
  `,
})
export class StepOneComponent implements OnInit, OnDestroy {
  stepOne = new FormGroup({
    email: new FormControl(),
    select: new FormControl(),
    multiSelect: new FormControl([]),
    textarea: new FormControl(),
  });

  constructor(private manager: NgFormsManager<AppForms>) {}

  ngOnInit() {
    this.manager.upsert('stepOne', this.stepOne);
  }

  ngOnDestroy() {
    this.manager.unsubscribe('stepOne');
  }
}
