import { InjectionToken } from '@angular/core';

export type Config = {
  storage: {
    key: string;
  };
  debounceTime: number;
};

const defaults: Config = {
  storage: {
    key: 'ngFormsManager',
  },
  debounceTime: 300,
};

export function mergeConfig(
  defaults: Partial<Config>,
  providerConfig: Partial<Config> = {},
  inlineConfig: Partial<Config>
) {
  return {
    ...defaults,
    storage: {
      ...defaults.storage,
      ...providerConfig.storage,
      ...inlineConfig.storage,
    },
    ...providerConfig,
    ...inlineConfig,
  } as Config;
}

export class NgFormsManagerConfig {
  constructor(private config: Partial<Config> = {}) {}

  merge(inline: Partial<Config> = {}): Config {
    return mergeConfig(defaults, this.config, inline);
  }
}

export const NG_FORMS_MANAGER_CONFIG = new InjectionToken<NgFormsManagerConfig>(
  'NG_FORMS_MANAGER_CONFIG',
  {
    providedIn: 'root',
    factory: () => {
      return new NgFormsManagerConfig();
    },
  }
);
