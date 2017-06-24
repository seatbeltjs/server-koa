/// <reference types="koa" />
/// <reference types="koa-router" />
/// <reference types="koa-bodyparser" />
import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Server } from '@seatbelt/core/lib/server';
import { Log } from '@seatbelt/core';
export interface IServerConfig {
    port?: number;
}
export declare class KoaServer implements Server.BaseServer {
    log: Log;
    server: Koa;
    port: number;
    router: Router;
    constructor(config?: IServerConfig);
    conformServerControllerToSeatbeltController: Function;
    config: Server.Config;
    init: Server.Init;
}
