import system = require('system-commands')

// todo
export const createImage = async (name?: string, device?: string): Promise<string> => system(`dd if=${device} | gzip > ${name}.gz`)

export const copyImage = async (name?: string, device?: string): Promise<string> => system(`dd if=${device} | gzip > ${name}.gz`)

export const createImageListrTask = (name?: string, device?: string) => ({
  title: `Create image "${name}"`,
  task: async (ctx: any): Promise<string> => system(`dd if=${ctx.device ?? device} | gzip > ${name}.gz`),
  options: {
    persistentOutput: true,
  },
})

export const copyImageListrTask = async (name?: string, device?: string) => ({
  title: `copy image"${name}"`,
  task: async (ctx: any): Promise<string> => createImage(name, ctx.device ?? device),
  options: {
    persistentOutput: true,
  },
})
