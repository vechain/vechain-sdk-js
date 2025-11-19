"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_CONTENT = exports.CONTENT = void 0;
const src_1 = require("../../../src");
const CONTENT = src_1.Hex.of(src_1.Txt.of('Hello world - Здравствуйте - こんにちは!').bytes);
exports.CONTENT = CONTENT;
const NO_CONTENT = src_1.Hex.of('0x');
exports.NO_CONTENT = NO_CONTENT;
