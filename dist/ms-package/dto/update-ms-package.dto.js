"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMsPackageDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ms_package_dto_1 = require("./create-ms-package.dto");
class UpdateMsPackageDto extends (0, mapped_types_1.PartialType)(create_ms_package_dto_1.CreateMsPackageDto) {
}
exports.UpdateMsPackageDto = UpdateMsPackageDto;
//# sourceMappingURL=update-ms-package.dto.js.map