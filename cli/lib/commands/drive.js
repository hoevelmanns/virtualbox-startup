"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const listr2_1 = require("listr2");
const terminal_1 = require("../terminal");
class Drive extends command_1.Command {
    async run() {
        const { args, flags } = this.parse(Drive);
        const name = flags.create;
        try {
            await new listr2_1.Listr([
                terminal_1.selectDrive(),
                terminal_1.createDrive(),
            ], { concurrent: false }).run().then(test => console.log("test", test));
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.default = Drive;
Drive.description = 'Create or update a bootable drive with a VM-Box';
Drive.examples = [
    '$ orderboss drive',
];
Drive.flags = {
    help: command_1.flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    create: command_1.flags.string({ char: 'c', description: 'create' }),
    update: command_1.flags.string({ char: 'u', description: 'update' }),
    // flag with no value (-f, --force)
    force: command_1.flags.boolean({ char: 'f' }),
};
Drive.args = [{ name: 'name' }];
