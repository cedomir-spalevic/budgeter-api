import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { apply, asyncify, waterfall } from "async";
import { BudgeterRequest, BudgeterRequestAuth, StepFunctionBatchJobRequest } from "models/requests";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AsyncRoute<Req = any, Res = any> = (...args: Req[]) => Promise<Res>;
type SyncRoute<Req = any, Res = any> = (...args: Req[]) => Res;

type BatchRoute = (event: StepFunctionBatchJobRequest) => Promise<any>;

class Handler {
   private defaultResponseStatusCode: number;
   private routes: AsyncRoute[];
   private errorRoute: AsyncRoute<Error, APIGatewayProxyResult>;
   private authRoute: AsyncRoute<StepFunctionBatchJobRequest, BudgeterRequestAuth>;
   private requestTransformerRoute: AsyncRoute<
      APIGatewayProxyEvent,
      BudgeterRequest
   >;
   private responseTransformerRoute: AsyncRoute<any, APIGatewayProxyResult>;

   constructor() {
      this.defaultResponseStatusCode = 200;
      this.routes = [];
      this.errorRoute = handleErrorResponse;
      this.authRoute = undefined;
      this.requestTransformerRoute = asyncify(this.defaultRequestTransformer);
      this.responseTransformerRoute = asyncify(this.defaultResponseTransformer);
   }

   private getAsyncRoute(route: AsyncRoute | SyncRoute): AsyncRoute {
      if (route.constructor.name === "Function") return asyncify(route);
      return route;
   }

   private defaultRequestTransformer = async (
      event: StepFunctionBatchJobRequest
   ): Promise<Partial<BudgeterRequest>> => {
      let auth: BudgeterRequestAuth = {
         isAuthenticated: false,
         isAdmin: false
      };

      if (this.authRoute) {
         auth = await this.authRoute(event);
      }

      return {
         auth
      };
   };

   private defaultResponseTransformer = (
      response: any
   ): APIGatewayProxyResult => {
      return {
         statusCode: this.defaultResponseStatusCode,
         body: JSON.stringify(response)
      };
   };

   use(route: AsyncRoute | SyncRoute): Handler {
      this.routes.push(this.getAsyncRoute(route));
      return this;
   }

   useError(
      errorRoute:
         | AsyncRoute<Error, APIGatewayProxyResult>
         | SyncRoute<Error, APIGatewayProxyResult>
   ): Handler {
      this.errorRoute = this.getAsyncRoute(errorRoute);
      return this;
   }

   useAuth(
      authRoute:
         | AsyncRoute<StepFunctionBatchJobRequest, BudgeterRequestAuth>
         | SyncRoute<StepFunctionBatchJobRequest, BudgeterRequestAuth>
   ): Handler {
      this.authRoute = this.getAsyncRoute(authRoute);
      return this;
   }

   useRequestTransformer(
      route:
         | AsyncRoute<APIGatewayProxyEvent, BudgeterRequest>
         | SyncRoute<APIGatewayProxyEvent, BudgeterRequest>
   ): Handler {
      this.requestTransformerRoute = this.getAsyncRoute(route);
      return this;
   }

   useResponseTransformer(
      route:
         | AsyncRoute<any, APIGatewayProxyResult>
         | SyncRoute<any, APIGatewayProxyResult>
   ): Handler {
      this.responseTransformerRoute = this.getAsyncRoute(route);
      return this;
   }

   useDefaultResponseStatusCode(status: number): Handler {
      this.defaultResponseStatusCode = status;
      return this;
   }

   go(): BatchRoute {
      return async (event: StepFunctionBatchJobRequest) => {
         return new Promise((resolve) => {
            waterfall(
               [
                  apply(this.requestTransformerRoute, event),
                  ...this.routes,
                  this.responseTransformerRoute
               ],
               (error, result) => {
                  if (error) resolve(this.errorRoute(error));
                  resolve(result);
               }
            );
         });
      };
   }
}

export const middy = (): Handler => new Handler();
