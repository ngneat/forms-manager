import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { LOCAL_STORAGE_TOKEN, SESSION_STORAGE_TOKEN } from './injection-tokens';

const PLATFORM_BROWSER_ID: string = 'browser';
const PLATFORM_SERVER_ID: string = 'server';
const PLATFORM_WORKER_APP_ID: string = 'browserWorkerApp';
const PLATFORM_WORKER_UI_ID: string = 'browserWorkerUi';

describe('SESSION_STORAGE_TOKEN', () => {
  it('should contain the sessionStorage object on platform browser', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID }],
    });
    expect(TestBed.inject(SESSION_STORAGE_TOKEN)).toBe(sessionStorage);
  });
  it('should contain undefined on platform server', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_SERVER_ID }],
    });
    expect(TestBed.inject(SESSION_STORAGE_TOKEN)).toBeUndefined();
  });
  it('should contain undefined on platform worker app', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_WORKER_APP_ID }],
    });
    expect(TestBed.inject(SESSION_STORAGE_TOKEN)).toBeUndefined();
  });
  it('should contain undefined on platform worker ui', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_WORKER_UI_ID }],
    });
    expect(TestBed.inject(SESSION_STORAGE_TOKEN)).toBeUndefined();
  });
});

describe('LOCAL_STORAGE_TOKEN', () => {
  it('should contain the localStorage object on platform browser', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID }],
    });
    expect(TestBed.inject(LOCAL_STORAGE_TOKEN)).toBe(localStorage);
  });
  it('should contain undefined on platform server', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_SERVER_ID }],
    });
    expect(TestBed.inject(LOCAL_STORAGE_TOKEN)).toBeUndefined();
  });
  it('should contain undefined on platform worker app', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_WORKER_APP_ID }],
    });
    expect(TestBed.inject(LOCAL_STORAGE_TOKEN)).toBeUndefined();
  });
  it('should contain undefined on platform worker ui', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_WORKER_UI_ID }],
    });
    expect(TestBed.inject(LOCAL_STORAGE_TOKEN)).toBeUndefined();
  });
});
