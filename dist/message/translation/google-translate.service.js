"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleTranslateService = void 0;
const common_1 = require("@nestjs/common");
const v2_1 = require("@google-cloud/translate/build/src/v2");
let GoogleTranslateService = class GoogleTranslateService {
    translator;
    constructor() {
        this.translator = new v2_1.Translate();
    }
    async translateMessage(text) {
        const [detection] = await this.translator.detect(text);
        const originalLanguage = detection.language;
        const [translationEn] = await this.translator.translate(text, 'en');
        const [translationFr] = await this.translator.translate(text, 'fr');
        const [translationEs] = await this.translator.translate(text, 'es');
        return {
            originalLanguage,
            translationEn,
            translationFr,
            translationEs,
        };
    }
};
exports.GoogleTranslateService = GoogleTranslateService;
exports.GoogleTranslateService = GoogleTranslateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleTranslateService);
//# sourceMappingURL=google-translate.service.js.map