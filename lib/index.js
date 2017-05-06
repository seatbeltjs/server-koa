"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function DKoa() {
    return function (OriginalClassConstructor) {
        return function () {
            const origin = new OriginalClassConstructor();
            origin.__seatbelt__ = 'server';
            origin.__seatbelt_strap__ = function (classesByType) {
                this.Koa = require('koa');
                this.app = new this.Koa();
                this.body = require('koa-json-body');
                this.port = process.env.port || 3000;
                this.router = require('koa-router')();
                this.app.use(this.body({ limit: '10kb', fallback: true }));
                origin.__controller_wrapper__ = function (controllerFunction, ctx, next) {
                    controllerFunction({
                        next,
                        send: (response) => {
                            ctx.body = response;
                        },
                        params: Object.assign({}, typeof ctx.req.params === 'object' ? ctx.req.params : {}, typeof ctx.request.body === 'object' ? ctx.request.body : {}, typeof ctx.request.query === 'object' ? ctx.request.query : {})
                    }, ctx);
                };
                if (classesByType['route']) {
                    classesByType['route'].forEach((route) => {
                        const policies = [];
                        route.__seatbelt_config__.policies.forEach((routePolicyName) => {
                            classesByType['policy'].forEach((policy) => {
                                if (routePolicyName === policy.__name__) {
                                    policies.push(policy);
                                }
                            });
                        });
                        route['__seatbelt_config__'].type.forEach((eachType) => {
                            route['__seatbelt_config__'].path.forEach((eachPath) => {
                                policies.forEach(policy => {
                                    this.router[eachType.toLowerCase()](eachPath, (ctx, next) => origin.__controller_wrapper__(policy.controller, ctx, next));
                                });
                                this.router[eachType.toLowerCase()](eachPath, (ctx, next) => origin.__controller_wrapper__(route.controller, ctx, next));
                            });
                        });
                    });
                }
                this.app.use(this.router.routes());
                this.app.listen(this.port);
            };
            return origin;
        };
    };
}
exports.DKoa = DKoa;
