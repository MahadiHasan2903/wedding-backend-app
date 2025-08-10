"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = exports.MessageStatus = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["IMAGE"] = "image";
    MessageType["VIDEO"] = "video";
    MessageType["FILE"] = "file";
    MessageType["SYSTEM"] = "system";
})(MessageType || (exports.MessageType = MessageType = {}));
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["SENT"] = "sent";
    MessageStatus["DELIVERED"] = "delivered";
    MessageStatus["READ"] = "read";
})(MessageStatus || (exports.MessageStatus = MessageStatus = {}));
var Language;
(function (Language) {
    Language["EN"] = "en";
    Language["FR"] = "fr";
    Language["ES"] = "es";
})(Language || (exports.Language = Language = {}));
//# sourceMappingURL=message.enum.js.map