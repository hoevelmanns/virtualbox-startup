import {Command, flags} from '@oclif/command'
import {Listr} from 'listr2'
import {selectDriveListrTask, createImageListrTask} from '../../terminal'
import {isRoot} from '../../terminal'

export default class Create extends Command {
  static description = 'Create an image from drive'

  static examples = [
    '$ orderboss image:create',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    force: flags.boolean({char: 'f'}), // force
  }

  static args = [{name: 'name'}]

  async run() {
    if (!isRoot) {
      throw new Error('No permissions. Please run command as root')
    }

    const {args, flags} = this.parse(Create)

    await new Listr(
      [
        selectDriveListrTask(),
        createImageListrTask(args.name),
      ],
      {concurrent: false},
    ).run()
      .then(test => this.log('success:', test))
      .catch(error => this.error('error', error))
  }
}
