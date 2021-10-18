import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID, Provider } from '@angular/core';

/**
 * Injection Token to safely inject
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage} to Angular DI
 */
export const SESSION_STORAGE_TOKEN: InjectionToken<Storage | undefined> = new InjectionToken<
  Storage | undefined
>('SESSION_STORAGE_TOKEN', {
  providedIn: 'root',
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? sessionStorage : undefined),
});

/**
 * Injection Token to safely inject
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage} to Angular DI
 */
export const LOCAL_STORAGE_TOKEN: InjectionToken<Storage | undefined> = new InjectionToken<
  Storage | undefined
>('LOCAL_STORAGE_TOKEN', {
  providedIn: 'root',
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? localStorage : undefined),
});

/**
 * Injection Token to inject custom storage approach for persistence; must implement
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Storage} interface
 */
export const FORMS_MANAGER_STORAGE = new InjectionToken<Storage | undefined>(
  'FORMS_MANAGER_STORAGE',
  {
    providedIn: 'root',
    factory: () =>
      isPlatformBrowser(inject(PLATFORM_ID)) ? inject(LOCAL_STORAGE_TOKEN) : undefined,
  }
);

/**
 * Value provider that injects usage of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage} for persistence
 */
export const FORMS_MANAGER_SESSION_STORAGE_PROVIDER: Provider = {
  provide: FORMS_MANAGER_STORAGE,
  useExisting: SESSION_STORAGE_TOKEN,
};
