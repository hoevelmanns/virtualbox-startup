import {writeJson} from 'fs-extra'
import {Listr} from 'listr2'
import {
    setExtraDataConfig,
    setVmHardware, startVm,
} from './commands'
import {Config, ConfigValues, Ctx} from './types'
import chalk from "chalk"

const vm = require('minimist')(process.argv.slice(2))['machine'] ?? 'ODDYC'
const homePath = require('home-path')
const configFile = `${homePath}/.oddyc-config.json`
const extraDataConfig: ConfigValues = {
    'GUI/StatusBar/Enabled': false,
    'GUI/Fullscreen': true,
    'GUI/DefaultCloseAction': 'Shutdown',
    'GUI/ShowMiniToolBar': false,
    'GUI/MenuBar/Enabled': false,
}

export const start = async () => await new Listr([
    {
        title: 'Set Hardware of the VM',
        task: async (ctx: Ctx): Promise<Config> => ctx.vmConfig = await setVmHardware(vm),
    },
    {
        title: `Set ExtraData of VM`,
        task: async (): Promise<any> => setExtraDataConfig(vm, extraDataConfig),
    },
    {
        title: `Create config file`,
        task: async (ctx: Ctx): Promise<void> => await writeJson(configFile, ctx.vmConfig),
    },
    {
        title: 'Start the VM',
        task: async (): Promise<any> => startVm(vm),
    }
]).run()


start().then(({vmConfig}) => console.log([
    chalk.green('Configuration successfully created!'),
    `Network adapter mac: ${vmConfig.netMacAddress}`,
    `Network interface: ${vmConfig.netInterface}`,
    `CPU Cores: ${vmConfig.cpuCores}`,
].join('\n')))
