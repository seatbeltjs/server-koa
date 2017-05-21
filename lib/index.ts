import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';

export function DKoa(): any {
  return function(originalClassConstructor: new () => {}) {
    return class extends originalClassConstructor {
      public __seatbelt__: string;
      public __seatbelt_strap__: Function;
      constructor () {
        super();
        this.__seatbelt__ = 'server';
        this.__seatbelt_strap__ = function(routes: any[]) {
          this.server = new Koa();
          this.port = process.env.port || 3000;
          this.router = new Router();
          this.server.use(bodyParser({ enableTypes: ['json'] }));
          this.__controller_wrapper__ = function (route: any, ctx: any, next: Function) {
            route.controller({
              send: (response: any) => {
                ctx.body = response;
              },
              params: Object.assign(
                {},
                typeof ctx.req.params === 'object' ? ctx.req.params : {},
                typeof ctx.request.body === 'object' ? ctx.request.body : {},
                typeof ctx.request.query === 'object' ? ctx.request.query : {}
              )
            }, ctx);
          };
          if (routes && Array.isArray(routes)) {
            routes.forEach((route: any) => {
              route['__seatbelt_config__'].type.forEach((eachType: string) => {
                route['__seatbelt_config__'].path.forEach((eachPath: string) => {
                  this.router[eachType.toLowerCase()](eachPath, (ctx: any, next: Function) => this.__controller_wrapper__(route, ctx, next));
                });
              });
            });
          }
          this.server.use(this.router.routes());
          this.server.listen(this.port);
        };
      };
    };
  };
}
