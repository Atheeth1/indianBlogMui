"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentsSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});
exports.default = (0, mongoose_1.model)("Comments", commentsSchema);
//# sourceMappingURL=Comments.js.map