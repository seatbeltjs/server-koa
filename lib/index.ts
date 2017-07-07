import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { ServerPlugin } from '@seatbelt/core/plugins';
import { Log, Route } from '@seatbelt/core';

export interface ServerConfigInterface {
  port?: number;
}

@ServerPlugin.Register({
  name: 'KoaServer'
})
export class KoaServer implements ServerPlugin.BaseInterface {
  private log: Log = new Log('KoaServer');
  public server: Koa = new Koa();
  public port: number = process.env.port || 3000;
  public router: Router = new Router();

  public constructor(config?: ServerConfigInterface) {
    if (config) {
      if (config.port && typeof config.port === 'number') {
        this.port = config.port;
      }
    }
  }

  public conformServerControllerToSeatbeltController: Function = function (route: ServerPlugin.RouteInterface, ctx: Koa.Context) {
    const send = (status: number, body: Object) => {
      ctx.status = status;
      ctx.body = body;
    };

    const seatbeltResponse: Route.Response.BaseInterface = {
      send,
      ok: (body: Object) => send(200, body),
      created: (body: Object) => send(201, body),
      badRequest: (body: Object) => send(400, body),
      unauthorized: (body: Object) => send(401, body),
      forbidden: (body: Object) => send(403, body),
      notFound: (body: Object) => send(404, body),
      serverError: (body: Object) => send(500, body)
    };

    const seatbeltRequest: Route.Request.BaseInterface = {
      allParams: Object.assign(
        {},
        typeof ctx.request.body === 'object' ? ctx.request.body : {},
        typeof ctx.request.query === 'object' ? ctx.request.query : {}
      )
    };

    return route.controller(
      seatbeltRequest,
      seatbeltResponse,
      {
        ctx
      }
    );
  };

  public config: ServerPlugin.Config = function(seatbelt: any, cb: Function) {
    const routes: ServerPlugin.RouteInterface[] = seatbelt.plugins.route;

    this.server.use(bodyParser({ enableTypes: ['json'] }));
    if (routes && Array.isArray(routes)) {
      routes.forEach((route: ServerPlugin.RouteInterface) => {
        route['__routeConfig'].type.forEach((eachType: string) => {
          route['__routeConfig'].path.forEach((eachPath: string) => {
            this.router[eachType.toLowerCase()](eachPath, (ctx: Koa.Context) => this.conformServerControllerToSeatbeltController(route, ctx));
          });
        });
      });
    }
    cb();
  };

  public init: ServerPlugin.Init  = function() {
    this.server.use(this.router.routes());
    this.server.listen(this.port);
  };
}
