import type { LambdaResponse } from "./LambdaResponse";

export type CreateLambdaBoot = (event: any, context: any) => Promise<LambdaResponse>;
