import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { ServerPlugin } from '@seatbelt/core/plugins';
import { Log } from '@seatbelt/core';

export interface IServerConfig {
  port?: number;
}

@ServerPlugin.Register({
  name: 'KoaServer'
})
export class KoaServer implements ServerPlugin.BaseServer {
  private log: Log = new Log('KoaServer');
  public server: Koa = new Koa();
  public port: number = process.env.port || 3000;
  public router: Router = new Router();

  public constructor(config?: IServerConfig) {
    if (config) {
      if (config.port && typeof config.port === 'number') {
        this.port = config.port;
      }
    }
  }

  public conformServerControllerToSeatbeltController: Function = function (route: ServerPlugin.Route, ctx: Koa.Context) {
    const seatbeltResponse: ServerPlugin.Response = {
      send: (status: number, body: Object) => {
         ctx.body = body;
      }
    };

    const seatbeltRequest: ServerPlugin.Request = {
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

  public config: ServerPlugin.Config = function(seatbelt: any) {
    const routes: ServerPlugin.Route[] = seatbelt.plugins.route;

    this.server.use(bodyParser({ enableTypes: ['json'] }));
    if (routes && Array.isArray(routes)) {
      routes.forEach((route: ServerPlugin.Route) => {
        route['__routeConfig'].type.forEach((eachType: string) => {
          route['__routeConfig'].path.forEach((eachPath: string) => {
            this.router[eachType.toLowerCase()](eachPath, (ctx: Koa.Context) => this.conformServerControllerToSeatbeltController(route, ctx));
          });
        });
      });
    }
  };

  public init: ServerPlugin.Init  = function() {
    this.server.use(this.router.routes());
    this.server.listen(this.port);
  };
}
