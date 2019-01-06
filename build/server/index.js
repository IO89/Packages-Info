"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var routes_1 = require("./routes");
var app = express_1.default();
var PORT = process.env.PORT || 5000;
app.use(cors_1.default());
app.use('/packages', routes_1.PackagesRoutes);
app.listen(PORT, function () {
    console.log("Server is up " + PORT);
});
