import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { coerceArray } from './utils';

export function setValidators(
  control: AbstractControl,
  validator: ValidatorFn | ValidatorFn[] | null
) {
  control.setValidators(coerceArray(validator));
  control.updateValueAndValidity();
}

export function setAsyncValidators(
  control: AbstractControl,
  validator: AsyncValidatorFn | AsyncValidatorFn[] | null
) {
  control.setValidators(coerceArray(validator));
  control.updateValueAndValidity();
}
