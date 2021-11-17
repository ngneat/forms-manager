import { AbstractControl } from '@angular/forms';
import { PersistManager } from '@ngneat/storage';

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

export interface UpsertConfig<T = any> {
  persistState?: boolean;
  debounceTime?: number;
  persistManager?: PersistManager<T>;
  arrControlFactory?: ControlFactory | HashMap<ControlFactory>;
  withInitialValue?: boolean;
}
