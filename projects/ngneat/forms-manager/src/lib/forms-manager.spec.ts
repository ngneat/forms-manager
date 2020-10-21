import { fakeAsync, tick } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgFormsManager } from './forms-manager';
import { NgFormsManagerConfig } from './config';

// get forms snapshot
function getSnapshot(formsManager) {
  return formsManager.store.getValue();
}

describe('FormsManager', () => {
  let formsManager: NgFormsManager,
    control: FormControl,
    arr: FormArray,
    group: FormGroup,
    date: Date;

  beforeEach(() => {
    formsManager = new NgFormsManager(new NgFormsManagerConfig());
    control = new FormControl('', [Validators.required]);
    arr = new FormArray([]);
    group = new FormGroup({
      name: new FormControl(),
      email: new FormControl(),
      date: new FormControl(),
      phone: new FormGroup({
        number: new FormControl(),
        prefix: new FormControl(),
      }),
      arr: new FormArray([]),
    });
    date = new Date();

    formsManager
      .upsert('config', control)
      .upsert('arr', arr)
      .upsert('group', group);
  });

  afterEach(() => {
    formsManager.unsubscribe();
    formsManager = null;
  });

  it('should update the store with forms value', fakeAsync(() => {
    expect(getSnapshot(formsManager)).toEqual({
      config: {
        value: '',
        rawValue: null,
        valid: false,
        dirty: false,
        invalid: true,
        disabled: false,
        errors: { required: true },
        touched: false,
        pristine: true,
        pending: false,
      },
      arr: {
        value: [],
        rawValue: [],
        valid: true,
        dirty: false,
        invalid: false,
        disabled: false,
        errors: null,
        touched: false,
        pristine: true,
        pending: false,
        controls: [],
      },
      group: {
        value: {
          name: null,
          email: null,
          date: null,
          phone: {
            number: null,
            prefix: null,
          },
          arr: [],
        },
        rawValue: {
          name: null,
          email: null,
          date: null,
          phone: {
            number: null,
            prefix: null,
          },
          arr: [],
        },
        valid: true,
        dirty: false,
        invalid: false,
        disabled: false,
        errors: null,
        touched: false,
        pristine: true,
        pending: false,
        controls: {
          name: {
            value: null,
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          email: {
            value: null,
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          date: {
            value: null,
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          phone: {
            value: {
              number: null,
              prefix: null,
            },
            rawValue: {
              number: null,
              prefix: null,
            },
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
            controls: {
              number: {
                value: null,
                rawValue: null,
                valid: true,
                dirty: false,
                invalid: false,
                disabled: false,
                errors: null,
                touched: false,
                pristine: true,
                pending: false,
              },
              prefix: {
                value: null,
                rawValue: null,
                valid: true,
                dirty: false,
                invalid: false,
                disabled: false,
                errors: null,
                touched: false,
                pristine: true,
                pending: false,
              },
            },
          },
          arr: {
            controls: [],
            value: [],
            rawValue: [],
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
        },
      },
    });
    control.patchValue('New value');
    tick(301);
    expect(getSnapshot(formsManager)).toEqual({
      config: {
        value: 'New value',
        rawValue: null,
        valid: true,
        dirty: false,
        invalid: false,
        disabled: false,
        errors: null,
        touched: false,
        pristine: true,
        pending: false,
      },
      arr: {
        value: [],
        rawValue: [],
        valid: true,
        dirty: false,
        invalid: false,
        disabled: false,
        errors: null,
        touched: false,
        pristine: true,
        pending: false,
        controls: [],
      },
      group: {
        value: {
          name: null,
          email: null,
          date: null,
          phone: {
            number: null,
            prefix: null,
          },
          arr: [],
        },
        rawValue: {
          name: null,
          email: null,
          date: null,
          phone: {
            number: null,
            prefix: null,
          },
          arr: [],
        },
        valid: true,
        dirty: false,
        invalid: false,
        disabled: false,
        errors: null,
        touched: false,
        pristine: true,
        pending: false,
        controls: {
          name: {
            value: null,
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          email: {
            value: null,
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          date: {
            value: null,
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          phone: {
            value: {
              number: null,
              prefix: null,
            },
            rawValue: {
              number: null,
              prefix: null,
            },
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
            controls: {
              number: {
                value: null,
                rawValue: null,
                valid: true,
                dirty: false,
                invalid: false,
                disabled: false,
                errors: null,
                touched: false,
                pristine: true,
                pending: false,
              },
              prefix: {
                value: null,
                rawValue: null,
                valid: true,
                dirty: false,
                invalid: false,
                disabled: false,
                errors: null,
                touched: false,
                pristine: true,
                pending: false,
              },
            },
          },
          arr: {
            controls: [],
            value: [],
            rawValue: [],
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
        },
      },
    });
    arr.push(new FormControl('One'));
    arr.push(new FormControl('Two'));
    tick(301);
    expect(getSnapshot(formsManager)).toEqual({
      config: {
        value: 'New value',
        rawValue: null,
        valid: true,
        dirty: false,
        invalid: false,
        disabled: false,
        errors: null,
        touched: false,
        pristine: true,
        pending: false,
      },
      arr: {
        value: ['One', 'Two'],
        rawValue: ['One', 'Two'],
        valid: true,
        dirty: false,
        invalid: false,
        disabled: false,
        errors: null,
        touched: false,
        pristine: true,
        pending: false,
        controls: [
          {
            value: 'One',
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          {
            value: 'Two',
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
        ],
      },
      group: {
        value: {
          name: null,
          email: null,
          date: null,
          phone: {
            number: null,
            prefix: null,
          },
          arr: [],
        },
        rawValue: {
          name: null,
          email: null,
          date: null,
          phone: {
            number: null,
            prefix: null,
          },
          arr: [],
        },
        valid: true,
        dirty: false,
        invalid: false,
        disabled: false,
        errors: null,
        touched: false,
        pristine: true,
        pending: false,
        controls: {
          name: {
            value: null,
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          email: {
            value: null,
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          date: {
            value: null,
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          phone: {
            value: {
              number: null,
              prefix: null,
            },
            rawValue: {
              number: null,
              prefix: null,
            },
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
            controls: {
              number: {
                value: null,
                rawValue: null,
                valid: true,
                dirty: false,
                invalid: false,
                disabled: false,
                errors: null,
                touched: false,
                pristine: true,
                pending: false,
              },
              prefix: {
                value: null,
                rawValue: null,
                valid: true,
                dirty: false,
                invalid: false,
                disabled: false,
                errors: null,
                touched: false,
                pristine: true,
                pending: false,
              },
            },
          },
          arr: {
            controls: [],
            value: [],
            rawValue: [],
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
        },
      },
    });
    group.patchValue({
      name: 'Netanel',
      email: 'n@n.com',
      date: date,
      phone: {
        number: 1,
        prefix: 2,
      },
    });
    (group.get('arr') as FormArray).push(new FormControl('One'));
    (group.get('arr') as FormArray).push(new FormControl('Two'));
    tick(301);
    expect(getSnapshot(formsManager)).toEqual({
      config: {
        value: 'New value',
        rawValue: null,
        valid: true,
        dirty: false,
        invalid: false,
        disabled: false,
        errors: null,
        touched: false,
        pristine: true,
        pending: false,
      },
      arr: {
        value: ['One', 'Two'],
        rawValue: ['One', 'Two'],
        valid: true,
        dirty: false,
        invalid: false,
        disabled: false,
        errors: null,
        touched: false,
        pristine: true,
        pending: false,
        controls: [
          {
            value: 'One',
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          {
            value: 'Two',
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
        ],
      },
      group: {
        value: {
          name: 'Netanel',
          email: 'n@n.com',
          date: date,
          phone: {
            number: 1,
            prefix: 2,
          },
          arr: ['One', 'Two'],
        },
        rawValue: {
          name: 'Netanel',
          email: 'n@n.com',
          date: date,
          phone: {
            number: 1,
            prefix: 2,
          },
          arr: ['One', 'Two'],
        },
        valid: true,
        dirty: false,
        invalid: false,
        disabled: false,
        errors: null,
        touched: false,
        pristine: true,
        pending: false,
        controls: {
          name: {
            value: 'Netanel',
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          email: {
            value: 'n@n.com',
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          date: {
            value: date,
            rawValue: null,
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
          phone: {
            value: {
              number: 1,
              prefix: 2,
            },
            rawValue: {
              number: 1,
              prefix: 2,
            },
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
            controls: {
              number: {
                value: 1,
                rawValue: null,
                valid: true,
                dirty: false,
                invalid: false,
                disabled: false,
                errors: null,
                touched: false,
                pristine: true,
                pending: false,
              },
              prefix: {
                value: 2,
                rawValue: null,
                valid: true,
                dirty: false,
                invalid: false,
                disabled: false,
                errors: null,
                touched: false,
                pristine: true,
                pending: false,
              },
            },
          },
          arr: {
            controls: [
              {
                value: 'One',
                rawValue: null,
                valid: true,
                dirty: false,
                invalid: false,
                disabled: false,
                errors: null,
                touched: false,
                pristine: true,
                pending: false,
              },
              {
                value: 'Two',
                rawValue: null,
                valid: true,
                dirty: false,
                invalid: false,
                disabled: false,
                errors: null,
                touched: false,
                pristine: true,
                pending: false,
              },
            ],
            value: ['One', 'Two'],
            rawValue: ['One', 'Two'],
            valid: true,
            dirty: false,
            invalid: false,
            disabled: false,
            errors: null,
            touched: false,
            pristine: true,
            pending: false,
          },
        },
      },
    });
  }));

  it('should listen to changes - control', fakeAsync(() => {
    const spy = jasmine.createSpy('config control');
    formsManager.controlChanges('config').subscribe(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      value: '',
      rawValue: null,
      valid: false,
      dirty: false,
      invalid: true,
      disabled: false,
      errors: { required: true },
      touched: false,
      pristine: true,
      pending: false,
    });
    control.patchValue('Update!!!!');
    tick(301);
    expect(spy).toHaveBeenCalledTimes(2); // one before
    expect(spy).toHaveBeenCalledWith({
      value: 'Update!!!!',
      rawValue: null,
      valid: true,
      dirty: false,
      invalid: false,
      disabled: false,
      errors: null,
      touched: false,
      pristine: true,
      pending: false,
    });
  }));

  it('should listen to changes - control', fakeAsync(() => {
    const spy = jasmine.createSpy('config control');
    formsManager.controlChanges('config').subscribe(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      value: '',
      rawValue: null,
      valid: false,
      dirty: false,
      invalid: true,
      disabled: false,
      errors: { required: true },
      touched: false,
      pristine: true,
      pending: false,
    });
    control.patchValue('Update!!!!');
    tick(301);
    expect(spy).toHaveBeenCalledTimes(2); // one before
    expect(spy).toHaveBeenCalledWith({
      value: 'Update!!!!',
      rawValue: null,
      valid: true,
      dirty: false,
      invalid: false,
      disabled: false,
      errors: null,
      touched: false,
      pristine: true,
      pending: false,
    });
  }));

  it('should listen to changes - group', fakeAsync(() => {
    const spy = jasmine.createSpy('group control');
    formsManager.controlChanges('group').subscribe(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      value: {
        name: null,
        email: null,
        date: null,
        phone: {
          number: null,
          prefix: null,
        },
        arr: [],
      },
      rawValue: {
        name: null,
        email: null,
        date: null,
        phone: {
          number: null,
          prefix: null,
        },
        arr: [],
      },
      valid: true,
      dirty: false,
      invalid: false,
      disabled: false,
      errors: null,
      touched: false,
      pristine: true,
      pending: false,
      controls: {
        name: {
          value: null,
          rawValue: null,
          valid: true,
          dirty: false,
          invalid: false,
          disabled: false,
          errors: null,
          touched: false,
          pristine: true,
          pending: false,
        },
        email: {
          value: null,
          rawValue: null,
          valid: true,
          dirty: false,
          invalid: false,
          disabled: false,
          errors: null,
          touched: false,
          pristine: true,
          pending: false,
        },
        date: {
          value: null,
          rawValue: null,
          valid: true,
          dirty: false,
          invalid: false,
          disabled: false,
          errors: null,
          touched: false,
          pristine: true,
          pending: false,
        },
        phone: {
          value: {
            number: null,
            prefix: null,
          },
          rawValue: {
            number: null,
            prefix: null,
          },
          valid: true,
          dirty: false,
          invalid: false,
          disabled: false,
          errors: null,
          touched: false,
          pristine: true,
          pending: false,
          controls: {
            number: {
              value: null,
              rawValue: null,
              valid: true,
              dirty: false,
              invalid: false,
              disabled: false,
              errors: null,
              touched: false,
              pristine: true,
              pending: false,
            },
            prefix: {
              value: null,
              rawValue: null,
              valid: true,
              dirty: false,
              invalid: false,
              disabled: false,
              errors: null,
              touched: false,
              pristine: true,
              pending: false,
            },
          },
        },
        arr: {
          controls: [],
          value: [],
          rawValue: [],
          valid: true,
          dirty: false,
          invalid: false,
          disabled: false,
          errors: null,
          touched: false,
          pristine: true,
          pending: false,
        },
      },
    });
    group.patchValue({
      phone: {
        number: 3,
        prefix: 4,
      },
    });
    tick(301);
    expect(spy).toHaveBeenCalledTimes(2); // one before
    expect(spy).toHaveBeenCalledWith({
      value: {
        name: null,
        email: null,
        date: null,
        phone: {
          number: 3,
          prefix: 4,
        },
        arr: [],
      },
      rawValue: {
        name: null,
        email: null,
        date: null,
        phone: {
          number: 3,
          prefix: 4,
        },
        arr: [],
      },
      valid: true,
      dirty: false,
      invalid: false,
      disabled: false,
      errors: null,
      touched: false,
      pristine: true,
      pending: false,
      controls: {
        name: {
          value: null,
          rawValue: null,
          valid: true,
          dirty: false,
          invalid: false,
          disabled: false,
          errors: null,
          touched: false,
          pristine: true,
          pending: false,
        },
        email: {
          value: null,
          rawValue: null,
          valid: true,
          dirty: false,
          invalid: false,
          disabled: false,
          errors: null,
          touched: false,
          pristine: true,
          pending: false,
        },
        date: {
          value: null,
          rawValue: null,
          valid: true,
          dirty: false,
          invalid: false,
          disabled: false,
          errors: null,
          touched: false,
          pristine: true,
          pending: false,
        },
        phone: {
          value: {
            number: 3,
            prefix: 4,
          },
          rawValue: {
            number: 3,
            prefix: 4,
          },
          valid: true,
          dirty: false,
          invalid: false,
          disabled: false,
          errors: null,
          touched: false,
          pristine: true,
          pending: false,
          controls: {
            number: {
              value: 3,
              rawValue: null,
              valid: true,
              dirty: false,
              invalid: false,
              disabled: false,
              errors: null,
              touched: false,
              pristine: true,
              pending: false,
            },
            prefix: {
              value: 4,
              rawValue: null,
              valid: true,
              dirty: false,
              invalid: false,
              disabled: false,
              errors: null,
              touched: false,
              pristine: true,
              pending: false,
            },
          },
        },
        arr: {
          controls: [],
          value: [],
          rawValue: [],
          valid: true,
          dirty: false,
          invalid: false,
          disabled: false,
          errors: null,
          touched: false,
          pristine: true,
          pending: false,
        },
      },
    });
  }));

  it('should select the form', () => {
    const spy = jasmine.createSpy('select form');
    formsManager.controlChanges('config').subscribe(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      value: '',
      rawValue: null,
      valid: false,
      dirty: false,
      invalid: true,
      disabled: false,
      errors: {
        required: true,
      },
      touched: false,
      pristine: true,
      pending: false,
    });
  });

  it('should subscribe to validity', fakeAsync(() => {
    const spy = jasmine.createSpy('select form');
    formsManager.validityChanges('config').subscribe(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(false);
    control.patchValue('Valid!');
    tick(301);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(true);
    control.patchValue('');
    tick(301);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(false);
  }));

  it('should subscribe to errors', fakeAsync(() => {
    const spy = jasmine.createSpy('select form errors');
    formsManager.errorsChanges('config').subscribe(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ required: true });
    control.patchValue('Valid!');
    tick(301);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(null);
    control.patchValue('');
    tick(301);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({ required: true });
  }));

  it('should subscribe to errors inside group', fakeAsync(() => {
    const spy = jasmine.createSpy('select form group control errors');
    formsManager.errorsChanges('group', 'phone.number').subscribe(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(null);
    group.get('phone.number').setValidators(Validators.required);
    group.get('phone.number').updateValueAndValidity();
    tick(301);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith({ required: true });
    group.get('phone.number').patchValue(12);
    tick(301);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(null);
    group.get('phone.number').patchValue('');
    tick(301);
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith({ required: true });
  }));

  it('should subscribe to value', fakeAsync(() => {
    const spyPrefix = jasmine.createSpy('prefix');
    const spyEmail = jasmine.createSpy('email');

    formsManager.valueChanges('group', 'phone.prefix').subscribe(spyPrefix);
    formsManager.valueChanges('group', 'email').subscribe(spyEmail);

    expect(spyPrefix).toHaveBeenCalledTimes(1);
    expect(spyPrefix).toHaveBeenCalledWith(null);

    expect(spyEmail).toHaveBeenCalledTimes(1);
    expect(spyEmail).toHaveBeenCalledWith(null);

    group.get('email').patchValue('m@m.com');
    tick(301);
    expect(spyEmail).toHaveBeenCalledTimes(2);
    expect(spyEmail).toHaveBeenCalledWith('m@m.com');
    // should not effect the prefix subscription
    expect(spyPrefix).toHaveBeenCalledTimes(1);
    group.get('phone.prefix').patchValue('054');
    tick(301);
    // should not effect the email subscription
    expect(spyEmail).toHaveBeenCalledTimes(2);
    expect(spyPrefix).toHaveBeenCalledWith('054');
  }));

  it('should subscribe to value - form array', fakeAsync(() => {
    const spy = jasmine.createSpy('array');

    formsManager.valueChanges('group', 'arr').subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith([]);
    (group.get('arr') as FormArray).push(new FormControl('One'));
    (group.get('arr') as FormArray).push(new FormControl('Two'));
    tick(301);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(['One', 'Two']);
  }));

  describe('Initial Value', () => {
    const fakeData = {
      name: 'Chuck Norris',
      email: 'chuck@norris.org',
      date: '1940-03-10',
      phone: {
        number: '123456789007',
        prefix: '+00',
      },
    };

    const userForm = new FormGroup({
      name: new FormControl('Chuck Norris'),
      email: new FormControl('chuck@norris.org'),
      date: new FormControl('1940-03-10'),
      phone: new FormGroup({
        number: new FormControl('123456789007'),
        prefix: new FormControl('+00'),
      }),
    });

    it('should get and set initial Value for a control', () => {
      formsManager.setInitialValue('config', 'initial');

      expect(formsManager.getInitialValue('config')).toEqual('initial');
    });

    it('should get and set initial Value for a group of control', () => {
      formsManager.setInitialValue('group', fakeData);

      expect(formsManager.getInitialValue('group')).toEqual(fakeData);
    });

    it('should get initial Value for a group of control if withInitialValue option has been set in upsert', () => {
      formsManager.upsert('user', userForm, { withInitialValue: true });

      expect(formsManager.getInitialValue('user')).toEqual(fakeData);
    });

    it('should get initial Value for a group of control if withInitialValue option has been set in upsert', () => {
      formsManager.upsert('user', userForm, { withInitialValue: true });

      expect(formsManager.getInitialValue('user')).toEqual(fakeData);
    });

    it('should get undefined if withInitialValue option has been set in upsert', () => {
      formsManager.upsert('user', userForm);

      expect(formsManager.getInitialValue('user')).toBeUndefined();
    });

    it('should get undefined if no initial Value set', () => {
      expect(formsManager.getInitialValue('other')).toBeUndefined();
    });
  });

  describe('Debounce', () => {
    it('should update value after default debounce of 300ms for update on change controls', fakeAsync(() => {
      const updateOnChangeGroup = new FormGroup({
        name: new FormControl(null, { updateOn: 'change' }),
      });
      formsManager.upsert('updateOnChangeGroup', updateOnChangeGroup);

      updateOnChangeGroup.get('name').patchValue('Smith');

      tick(100);
      expect(formsManager.getControl('updateOnChangeGroup', 'name').value).toEqual(null);

      tick(301);
      expect(formsManager.getControl('updateOnChangeGroup', 'name').value).toEqual('Smith');
    }));

    it('should skip debounce and update value immediately for a form group set to update on blur', () => {
      const updateOnBlurGroup = new FormGroup(
        {
          name: new FormControl(),
        },
        { updateOn: 'blur' }
      );
      formsManager.upsert('updateOnBlurGroup', updateOnBlurGroup);

      updateOnBlurGroup.get('name').patchValue('Smith');

      expect(formsManager.getControl('updateOnBlurGroup', 'name').value).toEqual('Smith');
    });

    it('should skip debounce and update value immediately for a form control set to update on blur', () => {
      const updateOnBlurGroup = new FormGroup({
        name: new FormControl(null, { updateOn: 'blur' }),
      });
      formsManager.upsert('updateOnBlurGroup', updateOnBlurGroup);

      updateOnBlurGroup.get('name').patchValue('Smith');

      expect(formsManager.getControl('updateOnBlurGroup', 'name').value).toEqual('Smith');
    });
  });

  describe('Mark*', () => {
    let formsManager: NgFormsManager, userForm: FormGroup;

    beforeEach(() => {
      formsManager = new NgFormsManager(new NgFormsManagerConfig());

      userForm = new FormGroup({
        name: new FormControl(),
        email: new FormControl(),
        date: new FormControl(),
        phone: new FormGroup({
          number: new FormControl(),
          prefix: new FormControl(),
        }),
      });

      formsManager.upsert('user', userForm);
    });

    it('should mark control and its descendants as touched', () => {
      formsManager.markAllAsTouched('user');

      expect(formsManager.getControl('user').touched).toBeTrue();
      expect(formsManager.getControl('user', 'email').touched).toBeTrue();
      expect(formsManager.getControl('user', 'phone.number').touched).toBeTrue();
    });

    it('should mark control as touched', () => {
      formsManager.markAsTouched('user');

      expect(formsManager.getControl('user').touched).toBeTrue();
    });

    it('should mark control and its descendants as dirty', () => {
      formsManager.markAllAsDirty('user');

      expect(formsManager.getControl('user').dirty).toBeTrue();
      expect(formsManager.getControl('user', 'email').dirty).toBeTrue();
      expect(formsManager.getControl('user', 'phone.number').dirty).toBeTrue();
    });

    it('should mark control as dirty', () => {
      formsManager.markAsDirty('user');

      expect(formsManager.getControl('user').dirty).toBeTrue();
    });

    it('should mark control as pending', () => {
      formsManager.markAsPending('user');

      expect(formsManager.getControl('user').pending).toBeTrue();
    });

    it('should mark control as pristine', () => {
      formsManager.markAsPristine('user');

      expect(formsManager.getControl('user').pristine).toBeTrue();
    });

    it('should mark control as untouched', () => {
      formsManager.markAsUntouched('user');

      expect(formsManager.getControl('user').untouched).toBeTrue();
    });

    afterEach(() => {
      formsManager.unsubscribe();
      formsManager = null;
    });
  });
});
