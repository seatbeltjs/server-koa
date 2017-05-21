Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
function DKoa() {
    return function (originalClassConstructor) {
        return class extends originalClassConstructor {
            constructor() {
                super();
                this.__seatbelt__ = 'server';
                this.__seatbelt_strap__ = function (routes) {
                    this.server = new Koa();
                    this.port = process.env.port || 3000;
                    this.router = new Router();
                    this.server.use(bodyParser({ enableTypes: ['json'] }));
                    this.__controller_wrapper__ = function (route, ctx, next) {
                        route.controller({
                            send: (response) => {
                                ctx.body = response;
                            },
                            params: Object.assign({}, typeof ctx.req.params === 'object' ? ctx.req.params : {}, typeof ctx.request.body === 'object' ? ctx.request.body : {}, typeof ctx.request.query === 'object' ? ctx.request.query : {})
                        }, ctx);
                    };
                    if (routes && Array.isArray(routes)) {
                        routes.forEach((route) => {
                            route['__seatbelt_config__'].type.forEach((eachType) => {
                                route['__seatbelt_config__'].path.forEach((eachPath) => {
                                    this.router[eachType.toLowerCase()](eachPath, (ctx, next) => this.__controller_wrapper__(route, ctx, next));
                                });
                            });
                        });
                    }
                    this.server.use(this.router.routes());
                    this.server.listen(this.port);
                };
            }
            ;
        };
    };
}
exports.DKoa = DKoa;
