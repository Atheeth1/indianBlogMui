"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = require("mongoose");
const connectToDatabase = async () => {
    try {
        await (0, mongoose_1.connect)(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    }
    catch (err) {
        return console.log("not Connected to MongoDB");
    }
};
exports.connectToDatabase = connectToDatabase;
//# sourceMappingURL=connection.js.map