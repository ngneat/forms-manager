import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgFormsManager, setValidators } from '@ngneat/forms-manager';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
})
export class DemoComponent implements OnInit {
  sub: Subscription;
  email: FormControl;
  config;
  group: FormGroup;
  arr: FormArray;
  settings: FormGroup;

  constructor(private formsManager: NgFormsManager, private builder: FormBuilder) {}

  ngOnInit() {
    this.email = new FormControl(null, Validators.email);

    const createControl = value => new FormControl(value);

    this.arr = new FormArray([createControl('One')]);

    this.config = this.builder.group({
      skills: this.builder.array([]),
      someBoolean: this.builder.control(false),
      minAge: this.builder.control(null),
    });

    this.group = new FormGroup({
      email: new FormControl(),
      number: new FormControl(),
      price: new FormControl(null, Validators.min(10)),
      checkbox: new FormControl(true),
      phone: new FormGroup({
        number: new FormControl(),
        prefix: new FormControl(),
        a: new FormGroup({
          b: new FormControl(),
          c: new FormControl(),
        }),
      }),
    });

    this.sub = this.formsManager.selectValue('settings', 'minPrice').subscribe(minPrice => {
      setValidators(this.group.get('price'), Validators.min(minPrice));
    });

    this.settings = new FormGroup({
      minPrice: new FormControl(10),
    });

    this.formsManager.upsert('settings', this.settings);

    this.formsManager
      .upsert('single', this.email, { persistState: true })
      .upsert('config', this.config, {
        persistState: true,
        arrControlFactory: { skills: () => new FormControl(null, Validators.required) },
      })
      .upsert('group', this.group, {
        persistState: true,
      })
      .upsert('array', this.arr, { arrControlFactory: createControl, persistState: true });
  }

  addControl() {
    this.arr.push(this.builder.control(''));
  }

  addSkill() {
    this.config
      .get('skills')
      .push(this.builder.control(Math.random().toString(), Validators.required));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.formsManager.unsubscribe();
  }
}
