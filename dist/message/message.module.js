"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModule = void 0;
const message_gateway_1 = require("./message.gateway");
const message_service_1 = require("./message.service");
const common_1 = require("@nestjs/common");
const media_module_1 = require("../media/media.module");
const message_controller_1 = require("./message.controller");
const message_repository_1 = require("./repositories/message.repository");
const conversation_module_1 = require("../conversation/conversation.module");
const google_translate_service_1 = require("./translation/google-translate.service");
let MessageModule = class MessageModule {
};
exports.MessageModule = MessageModule;
exports.MessageModule = MessageModule = __decorate([
    (0, common_1.Module)({
        imports: [media_module_1.MediaModule, (0, common_1.forwardRef)(() => conversation_module_1.ConversationModule)],
        controllers: [message_controller_1.MessageController],
        providers: [
            message_service_1.MessageService,
            message_repository_1.MessageRepository,
            message_gateway_1.MessageGateway,
            google_translate_service_1.GoogleTranslateService,
        ],
        exports: [message_service_1.MessageService, message_repository_1.MessageRepository],
    })
], MessageModule);
//# sourceMappingURL=message.module.js.map