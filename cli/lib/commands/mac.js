"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const listr2_1 = require("listr2");
class MacAddress extends command_1.Command {
    async run() {
        const { args, flags } = this.parse(MacAddress);
        const name = flags.create;
        try {
            await new listr2_1.Listr([
            /*
             todo updateMac() use package https://www.npmjs.com/package/random-mac -> usbdata/virtualbox/ODDYC.vbox, line 56
  
             */
            ], { concurrent: false }).run().then(test => console.log("test", test));
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.default = MacAddress;
MacAddress.description = 'Create or update a bootable drive with a VM-Box';
MacAddress.examples = [
    '$ orderboss mac',
];
MacAddress.flags = {
    help: command_1.flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    create: command_1.flags.string({ char: 'c', description: 'create' }),
    update: command_1.flags.string({ char: 'u', description: 'update' }),
    // flag with no value (-f, --force)
    force: command_1.flags.boolean({ char: 'f' }),
};
MacAddress.args = [{ name: 'name' }];
