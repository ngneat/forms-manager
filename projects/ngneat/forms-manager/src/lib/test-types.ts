import { NgFormsManager, NgFormsManagerConfig } from '@ngneat/forms-manager';
import { FormControl, FormGroup } from '@angular/forms';

interface AppForms {
  formOne: string;
  formTwo: {
    name: string;
    age: number;
  };
}

const manager = new NgFormsManager<AppForms>(new NgFormsManagerConfig({}));

const formOne = new FormControl('');

const formTwo = new FormGroup({
  name: new FormControl(''),
  age: new FormControl(),
});

manager.upsert({ name: 'formOne', control: formOne });
manager.upsert({ name: 'formTwo', control: formTwo });

manager.validityChanges('formOne').subscribe(isValid => {
  // infer boolean
});
manager.dirtyChanges('formOne').subscribe(isDirty => {
  // infer boolean
});
manager.disableChanges('formOne').subscribe(isDisabled => {
  // infer boolean
});
manager.valueChanges('formOne').subscribe(value => {
  // infer string
  value.toLowerCase();
});

manager.valueChanges('formTwo').subscribe(group => {
  // infer { name: string, age: number }
  group.name;
  group.age;
});

manager.valueChanges<string>('formTwo', 'name').subscribe(name => {
  name.toLowerCase();
});

manager.controlChanges('formOne').subscribe(control => {
  // infer to string
  control.value.toLowerCase();
});

manager.controlChanges('formTwo').subscribe(group => {
  // infer { name: string, age: number }
  group.value.age;
  group.value.name;
});

manager.controlChanges<string>('formTwo', 'name').subscribe(nameControl => {
  console.log(nameControl.value);
});

manager.controlChanges('formOne').subscribe(control => {
  // infer to string
  control.value.toLowerCase();
});

manager.controlChanges('formTwo').subscribe(control => {
  // infer { name: string, age: number }
  control.value.name;
  control.value.age;
});

manager.patchValue('formOne', '');
manager.patchValue('formTwo', { name: '' });

// forces pass the whole object as the method expected
manager.setValue('formTwo', { name: '', age: 3 });
