"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMsPurchaseDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ms_purchase_dto_1 = require("./create-ms-purchase.dto");
class UpdateMsPurchaseDto extends (0, mapped_types_1.PartialType)(create_ms_purchase_dto_1.CreateMsPurchaseDto) {
}
exports.UpdateMsPurchaseDto = UpdateMsPurchaseDto;
//# sourceMappingURL=update-ms-purchase.dto.js.map