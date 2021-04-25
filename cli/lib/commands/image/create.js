"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const listr2_1 = require("listr2");
const terminal_1 = require("../../terminal");
class Create extends command_1.Command {
    async run() {
        const { args, flags } = this.parse(Create);
        await new listr2_1.Listr([
            terminal_1.selectDrive(),
            terminal_1.createImage(args.name),
        ], { concurrent: false }).run()
            .then(test => this.log(test))
            .catch(error => this.error(error));
    }
}
exports.default = Create;
Create.description = 'Create an image from drive';
Create.examples = [
    '$ orderboss image:create',
];
Create.flags = {
    help: command_1.flags.help({ char: 'h' }),
    force: command_1.flags.boolean({ char: 'f' }),
};
Create.args = [{ name: 'name' }];
