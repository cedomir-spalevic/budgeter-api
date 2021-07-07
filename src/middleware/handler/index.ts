import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { apply, asyncify, waterfall } from "async";
import { validateJSONBody } from "middleware/validators";
import { Form } from "models/requests";

/* eslint-disable @typescript-eslint/no-explicit-any */
type HandlerRoute = (...args: any[]) => Promise<any>;
type AnyHandlerRoute = (...args: any[]) => any;

type LambdaRoute = (event: APIGatewayProxyEvent) => Promise<any>;

class Handler {
   private requestTransformerRoute: HandlerRoute;
   private responseTransformerRoute: HandlerRoute;
   private defaultResponseStatusCode: number;
   private routes: HandlerRoute[];
   private errorRoute: HandlerRoute;

   constructor() {
      this.requestTransformerRoute = asyncify(this.defaultRequestTransformer);
      this.responseTransformerRoute = asyncify(this.defaultResponseTransformer);
      this.defaultResponseStatusCode = 200;
      this.routes = [];
      this.errorRoute = handleErrorResponse;
   }

   private getAsyncRoute(route: HandlerRoute | AnyHandlerRoute): HandlerRoute {
      if (route.constructor.name === "Function") return asyncify(route);
      return route;
   }

   private defaultRequestTransformer = (event: APIGatewayProxyEvent): Form => {
      return validateJSONBody(event.body);
   };

   private defaultResponseTransformer = (
      response: any
   ): APIGatewayProxyResult => {
      return {
         statusCode: this.defaultResponseStatusCode,
         body: JSON.stringify(response)
      };
   };

   use(route: HandlerRoute | AnyHandlerRoute): Handler {
      this.routes.push(this.getAsyncRoute(route));
      return this;
   }

   useError(errorRoute: HandlerRoute): Handler {
      this.errorRoute = errorRoute;
      return this;
   }

   useRequestTransformer(route: HandlerRoute | AnyHandlerRoute): Handler {
      this.requestTransformerRoute = this.getAsyncRoute(route);
      return this;
   }

   useResponseTransformer(route: HandlerRoute | AnyHandlerRoute): Handler {
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
                  ...this.routes.slice(1),
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
