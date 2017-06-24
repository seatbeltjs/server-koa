/// <reference types="koa" />
/// <reference types="koa-router" />
/// <reference types="koa-bodyparser" />
import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Log } from '@seatbelt/core';
export declare class KoaServer {
    log: Log;
    server: Koa;
    port: number;
    router: Router;
    conformServerControllerToSeatbeltController: Function;
    config: Function;
    init: Function;
}
export declare const server: KoaServer;
