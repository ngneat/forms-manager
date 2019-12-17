import { Inject, Injectable, Optional } from '@angular/core';
import { AbstractControl, Form } from '@angular/forms';
import { coerceArray, filterControlKeys, filterNil, isBrowser, mergeDeep } from './utils';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { FormsStore } from './forms-manager.store';
import { Control, ControlFactory, FormKeys, HashMap } from './types';
import { Config, NG_FORMS_MANAGER_CONFIG, NgFormsManagerConfig } from './config';
import { isEqual } from './isEqual';
import { deleteControl, findControl, handleFormArray, toStore } from './builders';

@Injectable({ providedIn: 'root' })
export class NgFormsManager<FormsState = any> {
  private readonly store: FormsStore<FormsState>;
  private valueChanges$$: Map<keyof FormsState, Subscription> = new Map();
  private instances$$: Map<keyof FormsState, AbstractControl> = new Map();
  private destroy$$ = new Subject();

  constructor(@Optional() @Inject(NG_FORMS_MANAGER_CONFIG) private config: NgFormsManagerConfig) {
    this.store = new FormsStore({} as FormsState);
  }

  /**
   *
   * @example
   *
   * Whether the control is valid
   *
   * const valid$ = manager.validityChanges('login');
   *
   */
  validityChanges(name: keyof FormsState, path?: string): Observable<boolean> {
    return this.controlChanges(name, path).pipe(map(control => control.valid));
  }

  /**
   *
   * @example
   *
   * Whether the control is dirty
   *
   * const dirty$ = manager.dirtyChanges('login');
   *
   */
  dirtyChanges(name: keyof FormsState, path?: string): Observable<boolean> {
    return this.controlChanges(name, path).pipe(map(control => control.dirty));
  }

  /**
   *
   * @example
   *
   * Whether the control is disabled
   *
   * const disabled$ = manager.disableChanges('login');
   *
   */
  disableChanges(name: keyof FormsState, path?: string): Observable<boolean> {
    return this.controlChanges(name, path).pipe(map(control => control.disabled));
  }

  /**
   *
   * @example
   *
   * Observe the control's value
   *
   * const value$ = manager.valueChanges('login');
   * const value$ = manager.valueChanges<string>('login', 'email');
   *
   */
  valueChanges<T = any>(name: keyof FormsState, path: string): Observable<T>;
  valueChanges<T extends keyof FormsState>(name: T, path?: string): Observable<FormsState[T]>;
  valueChanges(name: keyof FormsState, path?: string): Observable<any> {
    return this.controlChanges(name, path).pipe(map(control => control.value));
  }

  /**
   *
   * @example
   *
   * Observe the control's errors
   *
   * const errors$ = manager.errorsChanges<Errors>('login');
   * const errors$ = manager.errorsChanges<Errors>('login', 'email');
   *
   */
  errorsChanges<Errors = any>(name: keyof FormsState, path?: string): Observable<Errors> {
    return this.controlChanges(name, path).pipe(map(control => control.errors as Errors));
  }

  /**
   *
   * @example
   *
   * Observe the control's state
   *
   * const control$ = manager.controlChanges('login');
   * const control$ = manager.controlChanges<string>('login', 'email');
   *
   */
  controlChanges<State = any>(name: keyof FormsState, path: string): Observable<Control<State>>;
  controlChanges<T extends keyof FormsState>(
    name: T,
    path?: string
  ): Observable<Control<FormsState[T]>>;
  controlChanges(name: keyof FormsState, path?: string): Observable<Control> {
    const control$ = this.store.select(state => state[name as any]).pipe(filterNil);
    if (!path) {
      return control$.pipe(distinctUntilChanged((a, b) => isEqual(a, b)));
    }

    return control$.pipe(
      map(control => findControl(control, path)),
      distinctUntilChanged((a, b) => isEqual(a, b))
    );
  }

  /**
   *
   * @example
   *
   * Emits when the control is destroyed
   *
   * const control$ = manager.controlChanges('login').pipe(takeUntil(controlDestroyed('login')))
   *
   */
  controlDestroyed(name: keyof FormsState) {
    return this.destroy$$
      .asObservable()
      .pipe(filter(controlName => name === controlName || controlName === '$$ALL'));
  }

  /**
   *
   * @example
   *
   * Get the control's state
   *
   * const control = manager.getControl('login');
   * const control = manager.getControl<string>('login', 'email');
   *
   */
  getControl<State = any>(name: keyof FormsState, path: string): Control<State> | null;
  getControl<T extends keyof FormsState>(name: T, path?: string): Control<FormsState[T]> | null;
  getControl(name: keyof FormsState, path?: string): Control | null {
    if (!path) {
      return this.store.getValue()[name] as any;
    }

    if (this.hasControl(name)) {
      const control = this.getControl(name);
      return findControl(control, path);
    }

    return null;
  }

  /**
   *
   * @example
   *
   *  Whether the form exists
   *
   * manager.hasControl('login');
   * manager.hasControl('login', 'email');
   *
   */
  hasControl(name: keyof FormsState, path?: string): boolean {
    return !!this.getControl(name, path);
  }

  /**
   *
   * @example
   *
   * A proxy to the original `patchValue` method
   *
   * manager.patchValue('login', { email: '' });
   *
   */
  patchValue<T extends keyof FormsState>(
    name: T,
    value: Partial<FormsState[T]>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ) {
    if (this.instances$$.has(name)) {
      this.instances$$.get(name).patchValue(value, options);
    }
  }

  /**
   *
   * @example
   *
   * A proxy to the original `setValue` method
   *
   * manager.setValue('login', { email: '', name: '' });
   *
   */
  setValue<T extends keyof FormsState>(
    name: keyof FormsState,
    value: FormsState[T],
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ) {
    if (this.instances$$.has(name)) {
      this.instances$$.get(name).setValue(value, options);
    }
  }

  /**
   *
   * @example
   *
   * manager.unsubscribe('login');
   *
   */
  unsubscribe(name?: FormKeys<FormsState>) {
    if (name) {
      const names = coerceArray(name);
      for (const name of names) {
        if (this.valueChanges$$.has(name)) {
          this.valueChanges$$.get(name).unsubscribe();
        }
        this.valueChanges$$.delete(name);
        this.instances$$.delete(name);
        this.destroy$$.next(name);
      }
    } else {
      this.valueChanges$$.forEach(subscription => {
        subscription.unsubscribe();
        this.destroy$$.next('$$ALL');
      });
      this.valueChanges$$.clear();
      this.instances$$.clear();
    }
  }

  /**
   *
   * @example
   *
   * Removes the control from the store and from LocalStorage
   *
   * manager.clear('login');
   *
   */
  clear(name?: FormKeys<FormsState>) {
    name ? this.deleteControl(name) : this.store.set({} as FormsState);
    this.removeFromStorage();
  }

  /**
   *
   * @example
   *
   * Calls unsubscribe and clear
   *
   * manager.destroy('login');
   *
   */
  destroy(name?: FormKeys<FormsState>) {
    this.unsubscribe(name);
    this.clear(name);
  }

  /**
   *
   * @example
   *
   * Register a control
   *
   * manager.upsert('login', this.login);
   * manager.upsert('login', this.login, { persistState: true });
   * manager.upsert('login', this.login, { debounceTime: 500 });
   *
   * manager.upsert('login', this.login, { arrControlFactory: value => new FormControl('') });
   *
   */
  upsert(
    name: keyof FormsState,
    control: AbstractControl,
    config: {
      persistState?: boolean;
      debounceTime?: number;
      arrControlFactory?: ControlFactory | HashMap<ControlFactory>;
    } = {}
  ) {
    const mergedConfig = this.config.merge(config) as Config & { arrControlFactory; persistState };

    if (isBrowser() && config.persistState && this.hasControl(name) === false) {
      const storageValue = this.getFromStorage(mergedConfig.storage.key);
      if (storageValue[name]) {
        this.store.update({
          [name]: mergeDeep(toStore(name, control), storageValue[name]),
        } as Partial<FormsState>);
      }
    }

    /** If the control already exist, patch the control with the store value */
    if (this.hasControl(name) === true) {
      control.patchValue(this.toControlValue(name, control, mergedConfig.arrControlFactory), {
        emitEvent: false,
      });
    } else {
      const value = this.updateStore(name, control);
      this.updateStorage(name, value, mergedConfig);
    }

    const unsubscribe = merge(
      control.valueChanges,
      control.statusChanges.pipe(distinctUntilChanged())
    )
      .pipe(debounceTime(mergedConfig.debounceTime))
      .subscribe(() => {
        const value = this.updateStore(name, control);
        this.updateStorage(name, value, mergedConfig);
      });

    this.valueChanges$$.set(name, unsubscribe);
    this.instances$$.set(name, control);

    return this;
  }

  private removeFromStorage() {
    localStorage.setItem(this.config.merge().storage.key, JSON.stringify(this.store.getValue()));
  }

  private updateStorage(name: keyof FormsState, value: any, config) {
    if (isBrowser() && config.persistState) {
      const storageValue = this.getFromStorage(config.storage.key);
      storageValue[name] = filterControlKeys(value);
      localStorage.setItem(config.storage.key, JSON.stringify(storageValue));
    }
  }

  private getFromStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  private deleteControl(name: FormKeys<FormsState>) {
    this.store.set(deleteControl(this.store.getValue(), coerceArray(name)) as FormsState);
  }

  private toControlValue(
    name: keyof FormsState,
    control: AbstractControl,
    arrControlFactory: ControlFactory | HashMap<ControlFactory>
  ) {
    const currentControl = this.getControl(name);
    const value = currentControl.value;

    /** It means it's not a FormGroup or FormArray */
    if (!currentControl.controls) {
      return value;
    }

    handleFormArray(value, control, arrControlFactory);
    return value;
  }

  private updateStore(name: keyof FormsState, control: AbstractControl) {
    const value = toStore<FormsState>(name, control);
    this.store.update({
      [name]: value,
    } as any);

    return value;
  }
}
