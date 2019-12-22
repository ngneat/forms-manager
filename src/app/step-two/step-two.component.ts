import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgFormsManager } from '@ngneat/forms-manager';

@Component({
  selector: 'app-step-two',
  template: `
    <form class="form-group" [formGroup]="stepTwo">
      <div class="form-group form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="exampleCheck1"
          formControlName="checkbox"
        />
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>

      <button class="btn btn-info btn-sm" (click)="addSkill()">Add Skill</button>
      <ng-container formArrayName="skills">
        <div class="form-group mt" *ngFor="let _ of stepTwo.get('skills').controls; index as i">
          <input class="form-control" [formControlName]="i" />
        </div>
      </ng-container>
      <code>Value: {{ stepTwo.value | json }}</code>
    </form>
  `,
})
export class StepTwoComponent implements OnInit, OnDestroy {
  stepTwo = new FormGroup({
    checkbox: new FormControl(false),
    skills: new FormArray([new FormControl('JS', Validators.required)]),
  });

  constructor(private manager: NgFormsManager<AppForms>) {}

  ngOnInit() {
    this.manager.upsert('stepTwo', this.stepTwo, {
      arrControlFactory: {
        skills: value => new FormControl(value, Validators.required),
      },
    });
  }

  addSkill() {
    (this.stepTwo.get('skills') as FormArray).push(new FormControl(''));
  }

  ngOnDestroy() {
    this.manager.unsubscribe('stepTwo');
  }
}
