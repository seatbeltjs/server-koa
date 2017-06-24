import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { DServerRegister, IServerRequest, IServerResponse, IServerRoute, Log } from '@seatbelt/core';

@DRegisterServer()
export class KoaServer {
  public log: Log = new Log('KoaServer');
  public server: Koa = new Koa();
  public port: number = process.env.port || 3000;
  public router: Router = new Router();
  public conformServerControllerToSeatbeltController: Function = function (route: any, ctx: Koa.Context) {
    route.controller({
      send: (response: any) => {
        ctx.body = response;
      },
      params: Object.assign(
        {},
        typeof ctx.request.body === 'object' ? ctx.request.body : {},
        typeof ctx.request.query === 'object' ? ctx.request.query : {}
      )
    }, ctx);
  };
  public config: Function = function(routes: any[]) {
    this.server.use(bodyParser({ enableTypes: ['json'] }));
    if (routes && Array.isArray(routes)) {
      routes.forEach((route: any) => {
        route['__seatbelt_config__'].type.forEach((eachType: string) => {
          route['__seatbelt_config__'].path.forEach((eachPath: string) => {
            this.router[eachType.toLowerCase()](eachPath, (ctx: Koa.Context) => this.conformServerControllerToSeatbeltController(route, ctx));
          });
        });
      });
    }
  };
  public init: Function  = function(routes: any[]) {
    this.server.use(this.router.routes());
    this.server.listen(this.port);
  };
}

export const server: KoaServer = new KoaServer();
