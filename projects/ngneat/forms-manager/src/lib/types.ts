import { AbstractControl } from '@angular/forms';

export type Control<T = any> = Pick<
  AbstractControl,
  | 'valid'
  | 'invalid'
  | 'disabled'
  | 'errors'
  | 'touched'
  | 'pristine'
  | 'pending'
  | 'dirty'
  | 'untouched'
> & { rawValue: T; value: T; controls?: { readonly [P in keyof T]: Control } };

export type ControlFactory = (value: any) => AbstractControl;

export interface HashMap<T = any> {
  [key: string]: T;
}

export type FormKeys<FormsState> = keyof FormsState | (keyof FormsState)[];

export interface UpsertConfig {
  persistState?: boolean;
  debounceTime?: number;
  arrControlFactory?: ControlFactory | HashMap<ControlFactory>;
  withInitialValue?: boolean;
}
