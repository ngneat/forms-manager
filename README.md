<br />

<p align="center">
 <img width="50%" height="50%" src="./logo.png">
</p>

> The Foundation for Proper Form Management in Angular

[![Build Status](https://img.shields.io/travis/datorama/akita.svg?style=flat-square)](https://travis-ci.org/ngneat/transloco)
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![coc-badge](https://img.shields.io/badge/codeof-conduct-ff69b4.svg?style=flat-square)]()
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e5079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

## 🔮 Features

✅ Allows Typed Forms!<br>
✅ Auto persists the form's state upon user navigation.<br>
✅ Provides an API to reactively querying any form, from anywhere. <br>
✅ Persist the form's state to local storage.<br>
✅ Built-in dirty functionality.

<hr />

`NgFormsManager` lets you sync Angular’s `FormGroup`, `FormControl`, and `FormArray`, via a unique store created for that purpose. The store will hold the controls' data like values, validity, pristine status, errors, etc.

This is powerful, as it gives you the following abilities:

1. It will automatically save the current control value and update the form value according to the value in the store when the user navigates back to the form.
2. It provides an API so you can query a form’s values and properties from anywhere. This can be useful for things like multi-step forms, cross-component validation and more.
3. It can persist the form's state to local storage.

<a href="https://www.buymeacoffee.com/basalnetanel" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

The goal in creating this was to work with the existing Angular form ecosystem, and save you the trouble of learning a new API. Let’s see how it works:

First, install the library:

## Installation

```
npm i @ngneat/forms-manager
```

Then, create a component with a form:

```ts
import { NgFormsManager } from '@ngneat/forms-manager';

@Component({
  template: `
    <form [formGroup]="onboardingForm">
      <input formControlName="name" />
      <input formControlName="age" />
      <input formControlName="city" />
    </form>
  `,
})
export class OnboardingComponent {
  onboardingForm: FormGroup;

  constructor(private formsManager: NgFormsManager, private builder: FormBuilder) {}

  ngOnInit() {
    this.onboardingForm = this.builder.group({
      name: [null, Validators.required],
      age: [null, Validators.required],
      city: [null, Validators.required],
    });

    this.formsManager.upsert('onboarding', this.onboardingForm);
  }

  ngOnDestroy() {
    this.formsManager.unsubscribe('onboarding');
  }
}
```

As you can see, we’re still working with the existing API in order to create a form in Angular. We’re injecting the `NgFormsManager` and calling the `upsert` method, giving it the form name and an `AbstractForm`.
From that point on, `NgFormsManager` will track the `form` value changes, and update the store accordingly.

With this setup, you’ll have an extensive API to query the store and update the form from anywhere in your application:

## API

- `valueChanges()` - Observe the control's value

```ts
const value$ = formsManager.valueChanges('onboarding');
const nameValue$ = formsManager.valueChanges<string>('onboarding', 'name');
```

- `validityChanges()` - Whether the control is valid

```ts
const valid$ = formsManager.validityChanges('onboarding');
const nameValid$ = formsManager.validityChanges('onboarding', 'name');
```

- `dirtyChanges()` - Whether the control is dirty

```ts
const dirty$ = formsManager.dirtyChanges('onboarding');
const nameDirty$ = formsManager.dirtyChanges('onboarding', 'name');
```

- `disableChanges()` - Whether the control is disabled

```ts
const disabled$ = formsManager.disableChanges('onboarding');
const nameDisabled$ = formsManager.disableChanges('onboarding', 'name');
```

- `errorsChanges()` - Observe the control's errors

```ts
const errors$ = formsManager.errorsChanges<Errors>('onboarding');
const nameErrors$ = formsManager.errorsChanges<Errors>('onboarding', 'name');
```

- `controlChanges()` - Observe the control's state

```ts
const control$ = formsManager.controlChanges('onboarding');
const nameControl$ = formsManager.controlChanges<string>('onboarding', 'name');
```

- `getControl()` - Get the control's state

```ts
const control = formsManager.getControl('onboarding');
const nameControl = formsManager.getControl<string>('onboarding', 'name');
```

`controlChanges` and `getControl` will return the following state:

```ts
{
   value: any,
   rawValue: object,
   errors: object,
   valid: boolean,
   dirty: boolean,
   invalid: boolean,
   disabled: boolean,
   touched: boolean,
   pristine: boolean,
   pending: boolean,
   untouched: boolean,
}
```

- `hasControl()` - Whether the control exists

```ts
const hasControl = formsManager.hasControl('onboarding');
```

- `patchValue()` - A proxy to the original `patchValue` method

```ts
formsManager.patchValue('onboarding', value, options);
```

- `setValue()` - A proxy to the original `setValue` method

```ts
formsManager.setValue('onboarding', value, options);
```

- `markAllAsTouched()` - A proxy to the original `markAllAsTouched` method

```ts
formsManager.markAllAsTouched('onboarding', options);
```

- `markAsTouched()` - A proxy to the original `markAsTouched` method

```ts
formsManager.markAsTouched('onboarding', options);
```

- `markAllAsDirty()` - Marks the control and all its descendant controls as dirty

```ts
formsManager.markAllAsDirty('onboarding', options);
```

- `markAsDirty()` - A proxy to the original `markAsDirty` method

```ts
formsManager.markAsDirty('onboarding', options);
```

- `markAsPending()` - A proxy to the original `markAsPending` method

```ts
formsManager.markAsPending('onboarding', options);
```

- `markAsPristine()` - A proxy to the original `markAsPristine` method

```ts
formsManager.markAsPristine('onboarding', options);
```

- `markAsUntouched()` - A proxy to the original `markAsUntouched` method

```ts
formsManager.markAsUntouched('onboarding', options);
```

- `unsubscribe()` - Unsubscribe from the form's `valueChanges` observable (always call it on `ngOnDestroy`)

```ts
formsManager.unsubscribe('onboarding');
formsManager.unsubscribe();
```

- `clear()` - Delete the form from the store

```ts
formsManager.clear('onboarding');
formsManager.clear();
```

- `destroy()` - Destroy the form (Internally calls `clear` and `unsubscribe`)

```ts
formsManager.destroy('onboarding');
formsManager.destroy();
```

- `controlDestroyed()` - Emits when the control is destroyed

```ts
formsManager.controlChanges('login').pipe(takeUntil(controlDestroyed('login')));
```

## Persist to Local Storage

In the `upsert` method, pass the `persistState` flag:

```ts
formsManager.upsert(formName, abstractContorl, {
  persistState: true;
});
```

## Validators

The library exposes two helpers method for adding cross component validation:

```ts
export function setValidators(
  control: AbstractControl,
  validator: ValidatorFn | ValidatorFn[] | null
);

export function setAsyncValidators(
  control: AbstractControl,
  validator: AsyncValidatorFn | AsyncValidatorFn[] | null
);
```

Here's an example of how we can use it:

```ts
export class HomeComponent{
  ngOnInit() {
    this.form = new FormGroup({
      price: new FormControl(null, Validators.min(10))
    });

    /*
    * Observe the `minPrice` value in the `settings` form
    * and update the price `control` validators
    */
    this.formsManager.valueChanges<number>('settings', 'minPrice')
     .subscribe(minPrice => setValidators(this.form.get('price'), Validators.min(minPrice));
  }
}
```

## Using FormArray Controls

When working with a `FormArray`, it's required to pass a `factory` function that defines how to create the `controls` inside the `FormArray`. For example:

```ts
import { NgFormsManager } from '@ngneat/forms-manager';

export class HomeComponent {
  skills: FormArray;
  config: FormGroup;

  constructor(private formsManager: NgFormsManager<FormsState>) {}

  ngOnInit() {
    this.skills = new FormArray([]);

    /** Or inside a FormGroup */
    this.config = new FormGroup({
      skills: new FormArray([]),
    });

    this.formsManager
      .upsert('skills', this.skills, { arrControlFactory: value => new FormControl(value) })
      .upsert('config', this.config, {
        arrControlFactory: { skills: value => new FormControl(value) },
      });
  }

  ngOnDestroy() {
    this.formsManager.unsubscribe();
  }
}
```

## NgFormsManager Generic Type

`NgFormsManager` can take a generic type where you can define the forms shape. For example:

```ts
interface AppForms = {
  onboarding: {
    name: string;
    age: number;
    city: string;
  }
}
```

This will make sure that the queries are typed, and you don't make any mistakes in the form name.

```ts
export class OnboardingComponent {
  constructor(private formsManager: NgFormsManager<AppForms>, private builder: FormBuilder) {}

  ngOnInit() {
    this.formsManager.valueChanges('onboarding').subscribe(value => {
      // value now typed as AppForms['onboarding']
    });
  }
}
```

Note that you can split the types across files using a definition file:

```ts
// login-form.d.ts
interface AppForms {
  login: {
    email: string;
    password: string
  }
}

// onboarding.d.ts
interface AppForms {
  onboarding: {
    ...
  }
}
```

## Using the Dirty Functionality

The library provides built-in support for the common "Is the form dirty?" question. Dirty means that the current control's
value is different from the initial value. It can be useful when we need to toggle the visibility of a "save" button or displaying a dialog when the user leaves the page.

To start using it, you should set the `withInitialValue` option:

```ts
@Component({
  template: `
    <button *ngIf="isDirty$ | async">Save</button>
  `,
})
export class SettingsComponent {
  isDirty$ = this.formsManager.initialValueChanged(name);

  constructor(private formsManager: NgFormsManager<AppForms>) {}

  ngOnInit() {
    this.formsManager.upsert(name, control, {
      withInitialValue: true,
    });
  }
}
```

### `setInitialValue(name, value)` - Set the initial form's value

```ts
formsManager.setInitialValue('form', initialValue);
```

### `getInitialValue(name)` - Get the initial value or `undefined` if not exist.

```ts
formsManager.getInitialValue('form');
```

## NgFormsManager Config

You can override the default config by passing the `NG_FORMS_MANAGER_CONFIG` provider:

```ts
import { NG_FORMS_MANAGER_CONFIG, NgFormsManagerConfig } from '@ngneat/forms-manager';

@NgModule({
  declarations: [AppComponent],
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: NG_FORMS_MANAGER_CONFIG,
      useValue: new NgFormsManagerConfig({
        debounceTime: 1000, // defaults to 300
        storage: {
          key: 'NgFormManager',
        },
      }),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.netbasal.com"><img src="https://avatars1.githubusercontent.com/u/6745730?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Netanel Basal</b></sub></a><br /><a href="https://github.com/ngneat/forms-manager/commits?author=NetanelBasal" title="Code">💻</a> <a href="https://github.com/ngneat/forms-manager/commits?author=NetanelBasal" title="Documentation">📖</a> <a href="#ideas-NetanelBasal" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/Coly010"><img src="https://avatars2.githubusercontent.com/u/12140467?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Colum Ferry</b></sub></a><br /><a href="https://github.com/ngneat/forms-manager/commits?author=Coly010" title="Code">💻</a> <a href="https://github.com/ngneat/forms-manager/commits?author=Coly010" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/mehmet-erim"><img src="https://avatars0.githubusercontent.com/u/34455572?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mehmet Erim</b></sub></a><br /><a href="https://github.com/ngneat/forms-manager/commits?author=mehmet-erim" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/dspeirs7"><img src="https://avatars2.githubusercontent.com/u/739058?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David Speirs</b></sub></a><br /><a href="https://github.com/ngneat/forms-manager/commits?author=dspeirs7" title="Code">💻</a> <a href="https://github.com/ngneat/forms-manager/commits?author=dspeirs7" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/manudss"><img src="https://avatars3.githubusercontent.com/u/1046806?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Emmanuel De Saint Steban</b></sub></a><br /><a href="https://github.com/ngneat/forms-manager/commits?author=manudss" title="Code">💻</a> <a href="https://github.com/ngneat/forms-manager/commits?author=manudss" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/adrianriepl"><img src="https://avatars2.githubusercontent.com/u/11076678?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adrian Riepl</b></sub></a><br /><a href="https://github.com/ngneat/forms-manager/commits?author=adrianriepl" title="Code">💻</a> <a href="https://github.com/ngneat/forms-manager/commits?author=adrianriepl" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
