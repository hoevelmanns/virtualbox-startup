import system = require('system-commands')

export const changeMacAddress = (device?: string) => ({
  title: `Create image "${name}"`,
  task: async (ctx: any): Promise<string> =>
    system('todo'),
  options: {
    persistentOutput: true,
  },
})
