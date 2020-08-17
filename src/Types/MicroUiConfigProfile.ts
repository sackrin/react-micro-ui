import type { MicroUiConfigProfileEnv } from "./MicroUiConfigProfileEnv";

export type MicroUiConfigProfile = {
  assets?: {
    url?: string,
    env?: MicroUiConfigProfileEnv
  },
  api?: {
    url?: string,
    path?: string,
    port?: number;
    cors?: { [key: string]: string };
    prefix?: string;
    messages?: {
      START_UP?: string;
      STARTED_UP?: string;
      CRASHED?: string;
    };
    env?: MicroUiConfigProfileEnv
  },
};
