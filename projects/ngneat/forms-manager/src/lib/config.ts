import { InjectionToken } from '@angular/core';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type StorageOption = 'LocalStorage' | 'SessionStorage';
export type Config = {
  storage: {
    type: StorageOption;
    key: string;
  };
  debounceTime: number;
};

const defaults: Config = {
  storage: {
    type: 'LocalStorage',
    key: 'ngFormsManager',
  },
  debounceTime: 300,
};

export function mergeConfig(
  defaults: Config,
  providerConfig: DeepPartial<Config> = {},
  inlineConfig: DeepPartial<Config>
): Config {
  return {
    ...defaults,
    ...providerConfig,
    ...inlineConfig,
    storage: {
      ...defaults.storage,
      ...providerConfig.storage,
      ...inlineConfig.storage,
    },
  };
}

export class NgFormsManagerConfig {
  constructor(private config: DeepPartial<Config> = {}) {}

  merge(inline: DeepPartial<Config> = {}): Config {
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
