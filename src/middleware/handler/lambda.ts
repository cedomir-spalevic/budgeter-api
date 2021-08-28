import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { apply, asyncify, waterfall } from "async";
import { validateJSONBody } from "middleware/validators";
import { BudgeterRequest, BudgeterRequestAuth, Form } from "models/requests";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AsyncRoute<Req = any, Res = any> = (...args: Req[]) => Promise<Res>;
type SyncRoute<Req = any, Res = any> = (...args: Req[]) => Res;

type LambdaRoute = (event: APIGatewayProxyEvent) => Promise<any>;

class Handler {
   private defaultResponseStatusCode: number;
   private parseJsonBody: boolean;
   private routes: AsyncRoute[];
   private errorRoute: AsyncRoute<Error, APIGatewayProxyResult>;
   private authRoute: AsyncRoute<APIGatewayProxyEvent, BudgeterRequestAuth>;
   private requestTransformerRoute: AsyncRoute<
      APIGatewayProxyEvent,
      BudgeterRequest
   >;
   private responseTransformerRoute: AsyncRoute<any, APIGatewayProxyResult>;

   constructor() {
      this.defaultResponseStatusCode = 200;
      this.parseJsonBody = false;
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
      event: APIGatewayProxyEvent
   ): Promise<BudgeterRequest> => {
      let auth: BudgeterRequestAuth = {
         isAuthenticated: false
      };
      let body: Form = {};

      if (this.authRoute) {
         auth = await this.authRoute(event);
      }
      if (this.parseJsonBody) {
         body = validateJSONBody(event.body);
      }

      return {
         auth,
         pathParameters: event.pathParameters,
         queryStrings: event.queryStringParameters,
         body
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

   useJsonBodyParser(): Handler {
      this.parseJsonBody = true;
      return this;
   }

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
         | AsyncRoute<APIGatewayProxyEvent, BudgeterRequestAuth>
         | SyncRoute<APIGatewayProxyEvent, BudgeterRequestAuth>
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

   go(): LambdaRoute {
      return async (event: APIGatewayProxyEvent) => {
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
