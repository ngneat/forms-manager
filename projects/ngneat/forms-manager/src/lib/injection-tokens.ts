import { isPlatformBrowser } from '@angular/common';
import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';

/**
 * Injection Token to safely inject {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage} to Angular DI
 */
export const SESSION_STORAGE_TOKEN: InjectionToken<Storage | undefined> = new InjectionToken<
  Storage | undefined
>('SESSION_STORAGE_TOKEN', {
  providedIn: 'root',
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? sessionStorage : undefined),
});

/**
 * Injection Token to safely inject {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage} to Angular DI
 */
export const LOCAL_STORAGE_TOKEN: InjectionToken<Storage | undefined> = new InjectionToken<
  Storage | undefined
>('LOCAL_STORAGE_TOKEN', {
  providedIn: 'root',
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? localStorage : undefined),
});
