import { Inject, Injectable, Optional } from '@angular/core';
import { AbstractControl, FormGroup, FormArray } from '@angular/forms';
import { coerceArray, filterControlKeys, filterNil, isBrowser, mergeDeep } from './utils';
import { EMPTY, merge, Observable, Subject, Subscription, timer } from 'rxjs';
import { debounce, distinctUntilChanged, filter, first, map, mapTo, take } from 'rxjs/operators';
import { FormsStore } from './forms-manager.store';
import { Control, ControlFactory, FormKeys, HashMap, UpsertConfig } from './types';
import { Config, NG_FORMS_MANAGER_CONFIG, NgFormsManagerConfig } from './config';
import { isEqual } from './isEqual';
import { deleteControl, findControl, handleFormArray, toStore } from './builders';
import { LocalStorageManager } from '@ngneat/storage';
import { wrapIntoObservable } from '@ngneat/storage/lib/utils';

const NO_DEBOUNCE = Symbol('NO_DEBOUNCE');

// @dynamic; see https://angular.io/guide/angular-compiler-options#strictmetadataemit
@Injectable({ providedIn: 'root' })
export class NgFormsManager<FormsState = any> {
  private readonly store: FormsStore<FormsState>;
  private valueChanges$$: Map<keyof FormsState, Subscription> = new Map();
  private instances$$: Map<keyof FormsState, AbstractControl> = new Map();
  private initialValues$$: Map<keyof FormsState, any> = new Map();
  private persistManager = new LocalStorageManager();
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
   * Whether the control is valid
   *
   * @example
   *
   * manager.isValid(name);
   *
   */
  isValid(name: keyof FormsState) {
    return this.hasControl(name) && this.getControl(name).valid;
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
   * Whether the initial control value is deep equal to current value
   *
   * @example
   *
   * const dirty$ = manager.initialValueChanged('settings');
   *
   */
  initialValueChanged(name: keyof FormsState): Observable<boolean> {
    if (this.initialValues$$.has(name) === false) {
      console.error(`You should set the withInitialValue option to the ${name} control`);
    }

    return this.valueChanges(name).pipe(
      map(current => isEqual(current, this.initialValues$$.get(name)) === false)
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
   * Get the initial value for a control
   *
   * Will return undefined, if no initial value was returned.
   *
   * @example
   *
   * manager.getInitialValue('login');
   *
   */
  getInitialValue<State = any>(name: keyof FormsState): State | undefined;
  getInitialValue<T extends keyof FormsState>(name: keyof FormsState): FormsState[T] | undefined;
  getInitialValue(name: keyof FormsState): any | undefined {
    return this.initialValues$$.get(name);
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
   * A proxy to the original `reset` method
   *
   * manager.reset('login', { email: '' });
   *
   */
  reset<T extends keyof FormsState>(
    name: T,
    value?: Partial<FormsState[T]>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ) {
    if (this.instances$$.has(name)) {
      this.instances$$.get(name).reset(value, options);
    }
  }

  /**
   *
   * Sets the initial value for a control
   *
   * @example
   *
   * manager.setInitialValue('login', value);
   *
   */
  setInitialValue(name: keyof FormsState, value: any) {
    this.initialValues$$.set(name, value);
  }

  /**
   *
   * @example
   *
   * A proxy to the original `markAllAsTouched` method
   *
   * manager.markAllAsTouched('login');
   *
   */
  markAllAsTouched(name: keyof FormsState): void {
    if (this.instances$$.has(name)) {
      this.instances$$.get(name).markAllAsTouched();

      this.updateStore(name, this.instances$$.get(name));
    }
  }

  /**
   *
   * @example
   *
   * A proxy to the original `markAsTouched` method
   *
   * manager.markAsTouched('login');
   *
   */
  markAsTouched(
    name: keyof FormsState,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void {
    if (this.instances$$.has(name)) {
      this.instances$$.get(name).markAsTouched(options);

      this.updateStore(name, this.instances$$.get(name));
    }
  }

  /**
   *
   * @example
   *
   * Marks the control and all its descendant controls as dirty.
   *
   * manager.markAllAsDirty('login');
   *
   */
  markAllAsDirty(
    name: keyof FormsState,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void {
    if (this.instances$$.has(name)) {
      let control = this.instances$$.get(name);

      this.markDescendantsAsDirty(control, options);

      this.updateStore(name, control);
    }
  }

  /**
   *
   * @example
   *
   * A proxy to the original `markAsDirty` method
   *
   * manager.markAsDirty('login');
   *
   */
  markAsDirty(
    name: keyof FormsState,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void {
    if (this.instances$$.has(name)) {
      this.instances$$.get(name).markAsDirty(options);

      this.updateStore(name, this.instances$$.get(name));
    }
  }

  /**
   *
   * @example
   *
   * A proxy to the original `markAsPending` method
   *
   * manager.markAsPending('login');
   *
   */
  markAsPending(
    name: keyof FormsState,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void {
    if (this.instances$$.has(name)) {
      this.instances$$.get(name).markAsPending(options);

      this.updateStore(name, this.instances$$.get(name));
    }
  }

  /**
   *
   * @example
   *
   * A proxy to the original `markAsPristine` method
   *
   * manager.markAsPristine('login');
   *
   */
  markAsPristine(
    name: keyof FormsState,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void {
    if (this.instances$$.has(name)) {
      this.instances$$.get(name).markAsPristine(options);

      this.updateStore(name, this.instances$$.get(name));
    }
  }

  /**
   *
   * @example
   *
   * A proxy to the original `markAsUntouched` method
   *
   * manager.markAsUntouched('login');
   *
   */
  markAsUntouched(
    name: keyof FormsState,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void {
    if (this.instances$$.has(name)) {
      this.instances$$.get(name).markAsUntouched(options);

      this.updateStore(name, this.instances$$.get(name));
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
   * Removes the control from the store and from given PersistStorageManager
   *
   * manager.clear('login');
   *
   */
  clear(name?: FormKeys<FormsState>) {
    name ? this.deleteControl(name) : this.store.set({} as FormsState);
    this.removeFromStorage();
    this.removeInitialValue(name);
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
  upsert(name: keyof FormsState, control: AbstractControl, config: UpsertConfig = {}) {
    const mergedConfig: Config & UpsertConfig = this.config.merge(config);

    if (mergedConfig.withInitialValue && this.initialValues$$.has(name) === false) {
      this.setInitialValue(name, control.value);
    }

    if (
      (isBrowser() || !(config.persistManager instanceof LocalStorageManager)) &&
      config.persistState &&
      this.hasControl(name) === false
    ) {
      this.persistManager = config.persistManager || this.persistManager;
      this.getFromStorage(mergedConfig.storage.key).subscribe(value => {
        const storageValue = value;
        if (storageValue[name]) {
          this.store.update({
            [name]: mergeDeep(toStore(name, control), storageValue[name]),
          } as Partial<FormsState>);
        }
      });
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
      control.statusChanges.pipe(distinctUntilChanged()),
      ...this.getValueChangeStreams(control)
    )
      .pipe(debounce(value => (value === NO_DEBOUNCE ? EMPTY : timer(mergedConfig.debounceTime))))
      .subscribe(() => {
        const value = this.updateStore(name, control);
        this.updateStorage(name, value, mergedConfig);
      });

    this.valueChanges$$.set(name, unsubscribe);
    this.instances$$.set(name, control);

    return this;
  }

  private getValueChangeStreams(control: AbstractControl) {
    const streams = [];

    if (control.updateOn === 'blur') {
      streams.push(control.valueChanges.pipe(mapTo(NO_DEBOUNCE)));
    } else {
      streams.push(control.valueChanges);

      if (control instanceof FormGroup) {
        return Object.keys(control.controls).reduce(
          (previous, key) =>
            control.get(key).updateOn === 'blur'
              ? [...previous, control.get(key).valueChanges.pipe(mapTo(NO_DEBOUNCE))]
              : [...previous],
          streams
        );
      }
    }

    return streams;
  }

  private removeFromStorage() {
    wrapIntoObservable(
      this.persistManager.setValue(this.config.merge().storage.key, this.store.getValue())
    )
      .pipe(first())
      .subscribe();
  }

  private updateStorage(name: keyof FormsState, value: any, config) {
    if (isBrowser() && config.persistState) {
      this.getFromStorage(config.storage.key)
        .pipe(first())
        .subscribe(valueFromStorage => {
          const storageValue = valueFromStorage;
          storageValue[name] = filterControlKeys(value);
          wrapIntoObservable(this.persistManager.setValue(config.storage.key, storageValue))
            .pipe(first())
            .subscribe();
        });
    }
  }

  private getFromStorage(key: string) {
    return wrapIntoObservable(this.persistManager.getValue(key)).pipe(take(1));
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

  private removeInitialValue(name?: FormKeys<FormsState>) {
    name
      ? coerceArray(name).forEach(name => this.initialValues$$.delete(name))
      : this.initialValues$$.clear();
  }

  private markDescendantsAsDirty(
    control: AbstractControl,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ) {
    control.markAsDirty(options);

    if (control instanceof FormGroup || control instanceof FormArray) {
      let controls: AbstractControl[] = Object.keys(control.controls).map(
        controlName => control.controls[controlName]
      );

      controls.forEach(control => {
        control.markAsDirty(options);

        if ((control as FormGroup | FormArray).controls) {
          this.markDescendantsAsDirty(control, options);
        }
      });
    }
  }
}
