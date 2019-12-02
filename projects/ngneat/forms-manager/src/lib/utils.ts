import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export type Diff<T, U> = T extends U ? never : T;

export const filterNil = <T>(source: Observable<T | undefined | null>) =>
  source.pipe(
    filter(
      (value): value is Diff<T, null | undefined> => value !== null && typeof value !== 'undefined'
    )
  );

export function coerceArray<T>(value: T | T[]): T[] {
  if (isNil(value)) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export function isNil(v) {
  return v === null || v === undefined;
}

export function clone(value: any): any {
  return isObject(value) ? { ...value } : Array.isArray(value) ? [...value] : value;
}

export function isObject(val) {
  if (val == null || Array.isArray(val)) {
    return false;
  }

  return typeof val === 'object';
}

const removeKeys = [
  'dirty',
  'disabled',
  'invalid',
  'pending',
  'errors',
  'pristine',
  'touched',
  'valid',
  'rawValue',
];

export function filterControlKeys(value) {
  return filterKeys(value, key => removeKeys.includes(key));
}

export function filterKeys(obj, cb) {
  const filtered = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (cb(key) === false) {
      if (isObject(value)) {
        filtered[key] = filterKeys(obj[key], cb);
      } else {
        filtered[key] = value;
      }
    }
  }

  return filtered;
}

export function isBrowser() {
  return typeof window !== 'undefined';
}
