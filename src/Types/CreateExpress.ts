import express from 'express';
import type { CreateExpressBoot } from "./CreateExpressBoot";
import type { CreateExpressStrap } from "./CreateExpressStrap";
import type { MicroUiConfig } from './MicroUiConfig';
import type { MicroUiConfigProfileEnv } from "./MicroUiConfigProfileEnv";
import type { CreateExpressOptions } from "./CreateExpressOptions";

export type CreateExpress = (options: CreateExpressOptions) => { api: express.Application, strap: CreateExpressStrap, boot: CreateExpressBoot, env: MicroUiConfigProfileEnv, config: MicroUiConfig, logger: any } | void;
