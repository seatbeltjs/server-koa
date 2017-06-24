import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { Server } from '@seatbelt/core/lib/server';
import { Log } from '@seatbelt/core';

export interface IServerConfig {
  port?: number;
}

@Server.Register()
export class KoaServer implements Server.BaseServer {
  public log: Log = new Log('KoaServer');
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

  public conformServerControllerToSeatbeltController: Function = function (route: Server.Route, ctx: Koa.Context) {
    const seatbeltResponse: Server.Response = {
      send: (status: number, body: Object) => {
         ctx.body = body;
      }
    };

    const seatbeltRequest: Server.Request = {
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

  public config: Server.Config = function(routes: Server.Route[]) {
    this.server.use(bodyParser({ enableTypes: ['json'] }));
    if (routes && Array.isArray(routes)) {
      routes.forEach((route: Server.Route) => {
        route['__seatbeltConfig'].type.forEach((eachType: string) => {
          route['__seatbeltConfig'].path.forEach((eachPath: string) => {
            this.router[eachType.toLowerCase()](eachPath, (ctx: Koa.Context) => this.conformServerControllerToSeatbeltController(route, ctx));
          });
        });
      });
    }
  };

  public init: Server.Init  = function() {
    this.server.use(this.router.routes());
    this.server.listen(this.port);
  };
}
