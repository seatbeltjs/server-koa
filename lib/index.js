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
const core_1 = require("@seatbelt/core");
let KoaServer = class KoaServer {
    constructor() {
        this.log = new core_1.Log('KoaServer');
        this.server = new Koa();
        this.port = process.env.port || 3000;
        this.router = new Router();
        this.conformServerControllerToSeatbeltController = function (route, ctx) {
            route.controller({
                send: (response) => {
                    ctx.body = response;
                },
                params: Object.assign({}, typeof ctx.request.body === 'object' ? ctx.request.body : {}, typeof ctx.request.query === 'object' ? ctx.request.query : {})
            }, ctx);
        };
        this.config = function (routes) {
            this.server.use(bodyParser({ enableTypes: ['json'] }));
            if (routes && Array.isArray(routes)) {
                routes.forEach((route) => {
                    route['__seatbelt_config__'].type.forEach((eachType) => {
                        route['__seatbelt_config__'].path.forEach((eachPath) => {
                            this.router[eachType.toLowerCase()](eachPath, (ctx) => this.conformServerControllerToSeatbeltController(route, ctx));
                        });
                    });
                });
            }
        };
        this.init = function (routes) {
            this.server.use(this.router.routes());
            this.server.listen(this.port);
        };
    }
};
KoaServer = __decorate([
    DRegisterServer()
], KoaServer);
exports.KoaServer = KoaServer;
exports.server = new KoaServer();
