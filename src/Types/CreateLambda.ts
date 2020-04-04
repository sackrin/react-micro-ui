import type { MicroUiConfig } from './MicroUiConfig';
import type { MicroUiConfigProfileEnv } from "./MicroUiConfigProfileEnv";
import type { CreateLambdaBoot } from "./CreateLambdaBoot";
import type { CreateLambdaStrap } from "./CreateLambdaStrap";
import type { CreateLambdaOptions } from "./CreateLambdaOptions";
import type { CreateLambdaRoute } from "./CreateLambdaRoute";
import type { LambdaResponse } from "./LambdaResponse";

export type CreateLambda = (event: any, context: any, options: CreateLambdaOptions) => { route: CreateLambdaRoute, strap: CreateLambdaStrap, boot: CreateLambdaBoot, env: MicroUiConfigProfileEnv, config: MicroUiConfig, logger: any } | LambdaResponse;
