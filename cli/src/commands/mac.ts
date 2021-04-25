import {Command, flags} from '@oclif/command'
import {Listr} from 'listr2'

export default class MacAddress extends Command {
  static description = 'Create or update a bootable drive with a VM-Box'

  static examples = [
    '$ orderboss mac',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    create: flags.string({char: 'c', description: 'create'}),
    update: flags.string({char: 'u', description: 'update'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}), // force
  }

  static args = [{name: 'name'}]

  async run() {
    const {args, flags} = this.parse(MacAddress)
    const name = flags.create

    try {
      await new Listr(
        [
          /*
           todo updateMac() use package https://www.npmjs.com/package/random-mac -> usbdata/virtualbox/ODDYC.vbox, line 56

           */
        ],
        {concurrent: false},
      ).run().then(test => console.log("test", test))
    } catch (e) {
      console.error(e)
    }
  }
}
