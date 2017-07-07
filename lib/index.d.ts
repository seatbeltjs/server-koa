/// <reference types="koa" />
/// <reference types="koa-router" />
/// <reference types="koa-bodyparser" />
import * as Koa from 'koa';
import * as Router from 'koa-router';
import { ServerPlugin } from '@seatbelt/core/plugins';
export interface ServerConfigInterface {
    port?: number;
}
export declare class KoaServer implements ServerPlugin.BaseInterface {
    private log;
    server: Koa;
    port: number;
    router: Router;
    constructor(config?: ServerConfigInterface);
    conformServerControllerToSeatbeltController: Function;
    config: ServerPlugin.Config;
    init: ServerPlugin.Init;
}
