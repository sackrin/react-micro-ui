import type { MicroUiConfigProfile } from './MicroUiConfigProfile';

export type MicroUiConfig = {
  name: string;
  assets: {
    target: string;
    url: string;
  };
  manifest: {
    filepath: string;
    entry: string;
  };
  api: {
    url: string;
    path: string;
    port?: number;
    cors?: { [key: string]: string };
    prefix?: string;
    messages: {
      START_UP: string;
      STARTED_UP: string;
      CRASHED: string;
    };
  };
  environments: {
    default: string;
    profiles: {
      [key: string]: MicroUiConfigProfile;
    };
  };
};
