import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFormsManager } from '@ngneat/forms-manager';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { takeUntil } from 'rxjs/operators';

type Forms = {
  name: string;
  login: {
    skills: string[];
    email: string;
  };
};

@Component({ templateUrl: './forms.component.html' })
export class FormsComponent implements OnInit, OnDestroy {
  name = new FormControl('');
  login = new FormGroup({
    email: new FormControl(''),
    skills: new FormArray([new FormControl('JS', Validators.required)]),
  });

  constructor(private manager: NgFormsManager<Forms>) {}

  ngOnInit() {
    this.manager.upsert('name', this.name);
    this.manager.upsert('login', this.login, {
      persistState: true,
      arrControlFactory: { skills: v => new FormControl(v, Validators.required) },
    });

    this.manager
      .valueChanges('login')
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        console.log(value);
      });
  }

  ngOnDestroy() {
    this.manager.unsubscribe();
  }

  addSkill() {
    (this.login.get('skills') as FormArray).push(new FormControl(''));
  }
}
