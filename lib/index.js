var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const plugins_1 = require("@seatbelt/core/plugins");
const core_1 = require("@seatbelt/core");
let KoaServer = class KoaServer {
    constructor(config) {
        this.log = new core_1.Log('KoaServer');
        this.server = new Koa();
        this.port = process.env.port || 3000;
        this.router = new Router();
        this.conformServerControllerToSeatbeltController = function (route, ctx) {
            const seatbeltResponse = {
                send: (status, body) => {
                    ctx.body = body;
                }
            };
            const seatbeltRequest = {
                allParams: Object.assign({}, typeof ctx.request.body === 'object' ? ctx.request.body : {}, typeof ctx.request.query === 'object' ? ctx.request.query : {})
            };
            return route.controller(seatbeltRequest, seatbeltResponse, {
                ctx
            });
        };
        this.config = function (seatbelt) {
            const routes = seatbelt.plugins.route;
            this.server.use(bodyParser({ enableTypes: ['json'] }));
            if (routes && Array.isArray(routes)) {
                routes.forEach((route) => {
                    route['__routeConfig'].type.forEach((eachType) => {
                        route['__routeConfig'].path.forEach((eachPath) => {
                            this.router[eachType.toLowerCase()](eachPath, (ctx) => this.conformServerControllerToSeatbeltController(route, ctx));
                        });
                    });
                });
            }
        };
        this.init = function () {
            this.server.use(this.router.routes());
            this.server.listen(this.port);
        };
        if (config) {
            if (config.port && typeof config.port === 'number') {
                this.port = config.port;
            }
        }
    }
};
KoaServer = __decorate([
    plugins_1.ServerPlugin.Register({
        name: 'KoaServer'
    })
], KoaServer);
exports.KoaServer = KoaServer;
