import {spawn} from 'child_process'
import * as drivelist from 'drivelist'

export const selectDriveListrTask = () => ({
  title: 'Select drive',
  task: async (ctx: any, task: any): Promise<void> => {
    const devices = await drivelist.list()

    ctx.device = await task.prompt({
      type: 'Select',
      name: 'device',
      choices: devices.map(d => ({
        name: d.device,
        message: `${d.device} - ${d.description}`,
      })),
    })
  },
  options: {
    persistentOutput: true,
  },
})

export const createDriveListrTask = () => ({
  title: 'Create drive please wait...',
  task: async (ctx: any, task: any): Promise<any> => {
    await spawn('echo', [ctx.device])
  },
  options: {
    persistentOutput: true,
  },
})
