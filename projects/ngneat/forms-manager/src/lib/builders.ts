import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Control, ControlFactory, HashMap } from './types';
import { clone } from './utils';

export function toStore<FormsState>(name: keyof FormsState, control: AbstractControl) {
  let value;

  if (control instanceof FormControl) {
    value = buildValue(control);
    return value;
  }

  if (control instanceof FormGroup || control instanceof FormArray) {
    value = buildValue(control);

    for (const key of Object.keys(control.controls)) {
      const current = control.controls[key];
      if (current instanceof FormGroup || current instanceof FormArray) {
        value.controls[key] = toStore(name, current);
      } else {
        value.controls[key] = buildValue(current);
      }
    }
  }

  return value;
}

export function handleFormArray(
  formValue: HashMap | any[],
  control: AbstractControl,
  arrControlFactory: ControlFactory | HashMap<ControlFactory>
) {
  if (control instanceof FormArray) {
    clearFormArray(control as FormArray);
    if (!arrControlFactory) {
      throw new Error('Please provide arrControlFactory');
    }
    formValue.forEach((v, i) =>
      (control as FormArray).insert(i, (arrControlFactory as Function)(v))
    );
  } else {
    Object.keys(formValue).forEach(controlName => {
      const value = formValue[controlName];
      if (Array.isArray(value) && control.get(controlName) instanceof FormArray) {
        if (!arrControlFactory || (arrControlFactory && !(controlName in arrControlFactory))) {
          throw new Error(`Please provide arrControlFactory for ${controlName}`);
        }
        const current = control.get(controlName) as FormArray;
        const fc = arrControlFactory[controlName];
        clearFormArray(current);
        value.forEach((v, i) => current.insert(i, fc(v)));
      }
    });
  }
}

export function deleteControl(snapshot, controls: any[]) {
  return Object.keys(snapshot).reduce((acc, currentFormName) => {
    if (controls.includes(currentFormName) === false) {
      acc[currentFormName] = snapshot[currentFormName];
    }
    return acc;
  }, {});
}

export function findControl(control: Control, path: string) {
  const [first, ...rest] = path.split('.');
  if (rest.length === 0) {
    return control.controls[first];
  }

  return rest.reduce((current: Control, name: string) => {
    return current.controls.hasOwnProperty(name) ? current.controls[name] : null;
  }, control.controls[first]);
}

export function buildValue(control: Partial<AbstractControl>): Control {
  const value = {
    value: clone(control.value), // Clone object to prevent issue with third party that would be affected by store freezing.
    rawValue: (control as any).getRawValue ? (control as any).getRawValue() : null,
    valid: control.valid,
    dirty: control.dirty,
    invalid: control.invalid,
    disabled: control.disabled,
    errors: control.errors,
    touched: control.touched,
    pristine: control.pristine,
    pending: control.pending,
  };

  if (control instanceof FormGroup || control instanceof FormArray) {
    value['controls'] = control instanceof FormArray ? [] : {};
  }

  return value;
}

export function clearFormArray(control: FormArray) {
  while (control.length !== 0) {
    control.removeAt(0);
  }
}
