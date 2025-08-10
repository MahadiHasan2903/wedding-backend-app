"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const roles_guard_1 = require("./common/guards/roles.guard");
const jwt_auth_guard_1 = require("./common/guards/jwt/jwt-auth.guard");
async function bootstrap() {
    dotenv.config();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CLIENT_BASE_URL,
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
    }));
    const reflector = app.get(core_1.Reflector);
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector), new roles_guard_1.RolesGuard(reflector));
    const port = process.env.PORT || 8080;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map