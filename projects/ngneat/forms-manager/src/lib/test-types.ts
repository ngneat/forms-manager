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

manager.upsert('formOne', formOne);
manager.upsert('formTwo', formTwo);

manager.selectValid('formOne').subscribe(isValid => {
  // infer boolean
});
manager.selectDirty('formOne').subscribe(isDirty => {
  // infer boolean
});
manager.selectDisabled('formOne').subscribe(isDisabled => {
  // infer boolean
});
manager.selectValue('formOne').subscribe(value => {
  // infer string
  value.toLowerCase();
});

manager.selectValue('formTwo').subscribe(group => {
  // infer { name: string, age: number }
  group.name;
  group.age;
});

manager.selectValue<string>('formTwo', 'name').subscribe(name => {
  name.toLowerCase();
});

manager.selectControl('formOne').subscribe(control => {
  // infer to string
  control.value.toLowerCase();
});

manager.selectControl<AppForms['formTwo']>('formTwo').subscribe(group => {
  // infer { name: string, age: number }
  group.value.age;
  group.value.name;
});

manager.selectControl<string>('formTwo', 'name').subscribe(nameControl => {
  console.log(nameControl.value);
});

manager.selectForm('formOne').subscribe(control => {
  // infer to string
  control.value.toLowerCase();
});

manager.selectForm('formTwo').subscribe(form => {
  // infer { name: string, age: number }
  form.value.name;
  form.value.age;
});

manager.patchValue('formOne', '');
manager.patchValue('formTwo', { name: '' });

// forces pass the whole object as the method expected
manager.setValue('formTwo', { name: '', age: 3 });
