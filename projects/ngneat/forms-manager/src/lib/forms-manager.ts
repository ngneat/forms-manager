import { Inject, Injectable, Optional } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { clone, coerceArray, filterControlKeys, filterNil, isBrowser, mergeDeep } from './utils';
import { merge, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormsStore } from './forms-manager.store';
import { _AbstractControl, AbstractGroup, ControlFactory, FormKeys, HashMap } from './types';
import { Config, NG_FORMS_MANAGER_CONFIG, NgFormsManagerConfig } from './config';
import isEqual from 'lodash.isequal';

@Injectable({ providedIn: 'root' })
export class NgFormsManager<FormsState = any> {
  private readonly store: FormsStore<FormsState>;
  private valueChanges: Map<keyof FormsState, Subscription> = new Map();
  private instances: Map<keyof FormsState, AbstractControl> = new Map();

  constructor(@Optional() @Inject(NG_FORMS_MANAGER_CONFIG) private config: NgFormsManagerConfig) {
    this.store = new FormsStore({} as FormsState);
  }

  selectValid(formName: keyof FormsState, path?: string): Observable<boolean> {
    return this.selectControl(formName, path).pipe(map(control => control.valid));
  }

  selectDirty(formName: keyof FormsState, path?: string): Observable<boolean> {
    return this.selectControl(formName, path).pipe(map(control => control.dirty));
  }

  selectDisabled(formName: keyof FormsState, path?: string): Observable<boolean> {
    return this.selectControl(formName, path).pipe(map(control => control.disabled));
  }

  selectValue<T extends keyof FormsState>(formName: T, path?: string): Observable<FormsState[T]>;
  selectValue<T = any>(formName: keyof FormsState, path: string): Observable<T>;
  selectValue(formName: keyof FormsState, path?: string): Observable<any> {
    return this.selectControl(formName, path).pipe(map(control => control.value));
  }

  selectErrors<T = any>(formName: keyof FormsState, path?: string): Observable<T> {
    return this.selectControl(formName, path).pipe(map(control => control.errors as T));
  }

  /**
   * If no path specified it means that it's a single FormControl or FormArray
   */
  selectControl<T = any>(
    formName: keyof FormsState,
    path?: string
  ): Observable<_AbstractControl<T>> {
    if (!path) {
      return this.selectForm(formName) as any;
    }

    return this.store
      .select(state => state[formName as any])
      .pipe(
        filterNil,
        map(form => this.resolveControl(form, path)),
        distinctUntilChanged((a, b) => isEqual(a, b))
      );
  }

  getControl<T = any>(formName: keyof FormsState, path?: string): _AbstractControl<T> {
    if (!path) {
      return this.getForm(formName) as any;
    }

    if (this.hasForm(formName)) {
      const form = this.getForm(formName);
      return this.resolveControl(form, path);
    }

    return null;
  }

  selectForm<T extends keyof FormsState>(
    formName: T,
    options: { filterNil: true } = { filterNil: true }
  ): Observable<AbstractGroup<FormsState[T]>> {
    return this.store
      .select(state => state[formName as any])
      .pipe(options.filterNil ? filterNil : s => s);
  }

  getForm<Name extends keyof FormsState>(
    formName: keyof FormsState
  ): AbstractGroup<FormsState[Name]> {
    return this.store.getValue()[formName as any];
  }

  hasForm(formName: keyof FormsState): boolean {
    return !!this.getForm(formName);
  }

  upsert(
    formName: keyof FormsState,
    form: AbstractControl,
    config: {
      persistState?: boolean;
      debounceTime?: number;
      arrControlFactory?: ControlFactory | HashMap<ControlFactory>;
    } = {}
  ) {
    const mergedConfig = this.config.merge(config) as Config & { arrControlFactory; persistState };
    if (isBrowser() && config.persistState && this.hasForm(formName) === false) {
      const storageValue = this.getFromStorage(mergedConfig.storage.key);
      if (storageValue[formName]) {
        this.store.update({
          [formName]: mergeDeep(this.buildFormStoreState(formName, form), storageValue[formName]),
        } as Partial<FormsState>);
      }
    }

    /** If the form already exist, patch the form with the store value */
    if (this.hasForm(formName) === true) {
      form.patchValue(this.resolveStoreToForm(formName, form, mergedConfig.arrControlFactory), {
        emitEvent: false,
      });
    } else {
      const value = this.updateStore(formName, form);
      this.updateStorage(formName, value, mergedConfig);
    }

    const unsubscribe = merge(form.valueChanges, form.statusChanges.pipe(distinctUntilChanged()))
      .pipe(debounceTime(mergedConfig.debounceTime))
      .subscribe(() => {
        const value = this.updateStore(formName, form);
        this.updateStorage(formName, value, mergedConfig);
      });

    this.valueChanges.set(formName, unsubscribe);
    this.instances.set(formName, form);

    return this;
  }

  patchValue<T extends keyof FormsState>(
    formName: T,
    value: Partial<FormsState[T]>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ) {
    if (this.instances.has(formName)) {
      this.instances.get(formName).patchValue(value, options);
    }
  }

  setValue<T extends keyof FormsState>(
    formName: keyof FormsState,
    value: FormsState[T],
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ) {
    if (this.instances.has(formName)) {
      this.instances.get(formName).setValue(value, options);
    }
  }

  clear(formName?: FormKeys<FormsState>) {
    if (formName) {
      this.removeFromStore(formName);
    } else {
      this.store.set({} as FormsState);
    }
    this.removeFromStorage();
  }

  destroy(formName?: FormKeys<FormsState>) {
    this.clear(formName);
    this.unsubscribe(formName);
  }

  removeFromStorage() {
    localStorage.setItem(this.config.merge().storage.key, JSON.stringify(this.store.getValue()));
  }

  unsubscribe(formName?: FormKeys<FormsState>) {
    const toArray = coerceArray(formName);
    if (formName) {
      toArray.forEach(name => {
        if (this.valueChanges.has(name)) {
          this.valueChanges.get(name).unsubscribe();
          this.valueChanges.delete(name);
        }
        this.instances.delete(name);
      });
    } else {
      this.valueChanges.forEach(subscription => subscription.unsubscribe());
      this.valueChanges.clear();
      this.instances.clear();
    }
  }

  private updateStorage(formName: keyof FormsState, value: any, config) {
    if (isBrowser() && config.persistState) {
      const storageValue = this.getFromStorage(config.storage.key);
      storageValue[formName] = filterControlKeys(value);
      localStorage.setItem(config.storage.key, JSON.stringify(storageValue));
    }
  }

  private getFromStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  private removeFromStore(formName: FormKeys<FormsState>) {
    const toArray = coerceArray(formName);
    const snapshot = this.store.getValue();
    const newState = Object.keys(snapshot).reduce((acc, currentFormName) => {
      if (toArray.includes(currentFormName as keyof FormsState) === false) {
        acc[currentFormName] = snapshot[currentFormName];
      }
      return acc;
    }, {});

    this.store.set(newState as FormsState);
  }

  private resolveControl(form, path: string) {
    const [first, ...rest] = path.split('.');
    if (rest.length === 0) {
      return form.controls[first];
    }

    return this.find(form.controls[first], rest);
  }

  private find(control: AbstractGroup, path: string[]) {
    return path.reduce((current: AbstractGroup, name: string) => {
      return current.controls.hasOwnProperty(name) ? current.controls[name] : null;
    }, control);
  }

  private resolveStoreToForm(
    formName: keyof FormsState,
    control: AbstractControl,
    arrControlFactory: ControlFactory | HashMap<ControlFactory>
  ) {
    const form = this.getForm(formName);
    const value = form.value;
    /** It means it a single control */
    if (!form.controls) {
      return value;
    }

    this.handleFormArray(value, control, arrControlFactory);
    return value;
  }

  private handleFormArray(
    formValue: HashMap | any[],
    control: AbstractControl,
    arrControlFactory: ControlFactory | HashMap<ControlFactory>
  ) {
    if (control instanceof FormArray) {
      this.cleanArray(control as FormArray);
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
            throw new Error('Please provide arrControlFactory for ' + controlName);
          }
          const current = control.get(controlName) as FormArray;
          const fc = arrControlFactory[controlName];
          this.cleanArray(current);
          value.forEach((v, i) => current.insert(i, fc(v)));
        }
      });
    }
  }

  private cleanArray(control: FormArray) {
    while (control.length !== 0) {
      control.removeAt(0);
    }
  }

  private buildFormStoreState(formName: keyof FormsState, form: AbstractControl) {
    let value;

    if (form instanceof FormControl) {
      value = this.resolveFormToStore(form);
    }

    if (form instanceof FormGroup || form instanceof FormArray) {
      // The root form group
      value = {
        ...this.resolveFormToStore(form),
        controls: {},
      };

      for (const key of Object.keys(form.controls)) {
        const control = form.controls[key];
        if (control instanceof FormGroup || form instanceof FormArray) {
          value.controls[key] = this.buildFormStoreState(formName, control);
        } else {
          value.controls[key] = this.resolveFormToStore(control);
        }
      }
    }

    return value;
  }

  private updateStore(formName: keyof FormsState, form: AbstractControl) {
    const value = this.buildFormStoreState(formName, form);
    this.store.update({
      [formName]: value,
    } as any);

    return value;
  }

  private resolveFormToStore(control: Partial<AbstractControl>): _AbstractControl {
    return {
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
  }
}
