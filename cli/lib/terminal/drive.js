"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDrive = exports.selectDrive = void 0;
const drivelist = require("drivelist");
const selectDrive = () => ({
    title: 'Select drive',
    task: async (ctx, task) => {
        const devices = await drivelist.list();
        ctx.device = await task.prompt({
            type: 'Select',
            name: 'device',
            choices: devices.map(d => ({
                name: d.device,
                message: `${d.device} - ${d.description}`,
            })),
        });
    },
    options: {
        persistentOutput: true,
    },
});
exports.selectDrive = selectDrive;
const child_process_1 = require("child_process");
const createDrive = () => ({
    title: 'Create drive please wait...',
    task: async (ctx, task) => {
        await child_process_1.spawn('echo', [ctx.device]);
    },
    options: {
        persistentOutput: true,
    },
});
exports.createDrive = createDrive;
