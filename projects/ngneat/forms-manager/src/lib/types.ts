import { AbstractControl } from '@angular/forms';

export type _AbstractControl<T = any> = Pick<
  AbstractControl,
  'valid' | 'invalid' | 'disabled' | 'errors' | 'touched' | 'pristine' | 'pending' | 'dirty'
> & { rawValue: T; value: T };

export interface AbstractGroup<C = any> extends _AbstractControl<C> {
  controls: { readonly [P in keyof C]: _AbstractControl };
}

export type ControlFactory = (value: any) => AbstractControl;

export interface HashMap<T = any> {
  [key: string]: T;
}

export type FormKeys<FormsState> = keyof FormsState | (keyof FormsState)[];
