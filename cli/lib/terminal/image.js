"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyImage = exports.createImage = void 0;
const system = require("system-commands");
const createImage = (name, device) => ({
    title: `Create image "${name}"`,
    task: async (ctx) => system(`dd if=${device !== null && device !== void 0 ? device : ctx.device} | gzip > ${name}.gz`),
    options: {
        persistentOutput: true,
    },
});
exports.createImage = createImage;
const copyImage = (name, device) => ({
    title: `Create image "${name}"`,
    task: async (ctx) => system(`dd if=${device !== null && device !== void 0 ? device : ctx.device} | gzip > ${name}.gz`),
    options: {
        persistentOutput: true,
    },
});
exports.copyImage = copyImage;
