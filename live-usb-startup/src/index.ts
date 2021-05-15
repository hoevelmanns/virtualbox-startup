import {Listr} from 'listr2'
import {
    init, saveConfig,
    setExtraDataConfig, setupWifi,
    setVmHardware, startVm, sysinfo,
} from './commands'
import {Config, ConfigValues, Ctx, LogoOptions} from './types'
import chalk from "chalk"
import delay from "delay"
import {existsSync} from "fs"

// ------------------ Custom Options
const terminalLogo = "./logo.png"
const logoOptions: LogoOptions = {width: '100%'}
const appName = "ODDYC portable"
// ------------------ Custom Options

const vm = require('minimist')(process.argv.slice(2))['machine'] ?? 'ODDYC'
const vmConfigFile = `./.oddyc-config.json`
const extraDataConfig: ConfigValues = {
    'GUI/StatusBar/Enabled': false,
    'GUI/Fullscreen': true,
    'GUI/DefaultCloseAction': 'Shutdown',
    'GUI/ShowMiniToolBar': false,
    'GUI/MenuBar/Enabled': false,
}

const start = new Listr([
    {
        title: 'Initialize',
        task: (ctx: Ctx) => ctx.config = init(vmConfigFile)
    },
    {
        title: 'Check Network',
        task: async (ctx: Ctx, task) => {

            await delay(2000)

            if ((await sysinfo.networkInterfaces())?.find((i: any) => i.operstate === 'up')) {
                return ctx.netIsUp = true
            }

            await delay(2000)

            if ((await (sysinfo.wifiInterfaces()))?.length > 0) {
                return ctx.hasWifi = true
            }

            await delay(2000)

            throw new Error(chalk.red.bold(`No Network found. Shutdown the machine.`))

        }, retry: 20
    },
    {
        title: 'Setup Wifi Connection',
        enabled: (ctx: Ctx): boolean => ctx.hasWifi && !ctx.netIsUp,
        task: async (ctx: Ctx, task) => await setupWifi(ctx, task),
        retry: 2
    },
    {
        title: 'Set VM Hardware',
        enabled: (ctx: Ctx): boolean => ctx.netIsUp,
        task: async (ctx: Ctx): Promise<Config> => ctx.config = await setVmHardware(vm, ctx),
    },
    {
        title: `Set VM ExtraData`,
        enabled: (ctx: Ctx): boolean => ctx.netIsUp,
        task: async (): Promise<any> => setExtraDataConfig(vm, extraDataConfig),
    },
    {
        title: `Save config`,
        enabled: (ctx: Ctx): boolean => ctx.netIsUp,
        task: async (ctx: Ctx): Promise<void> => saveConfig(vmConfigFile, ctx.config)
    },
    {
        title: 'Start the VM',
        enabled: (ctx: Ctx): boolean => ctx.netIsUp,
        task: async (): Promise<any> => startVm(vm),
    },
    /* todo Task for Machine State Listener
        VBoxManage showvminfo --machinereadable ODDYC
        https://davembush.medium.com/typescript-and-electron-the-right-way-141c2e15e4e1

        todo create task for the transport of the windows product key
        https://www.medo64.com/2020/10/windows-product-key-in-virtualbox-bios/
     */
], {exitOnError: false})

const terminalImage = require('terminal-image');

(async () => {
    existsSync(terminalLogo) && console.log(await terminalImage.file(terminalLogo, logoOptions ?? {}))
    console.log(require('boxen')(chalk.bold(appName), {padding: 1, borderStyle: 'bold', margin: {top: 2, bottom: 2}}))

    start.run()
        .then(({config}) => Object.keys(config).length > 0 && delay(3000) && console.log([
            chalk.white.underline('\nConfiguration'),
            `\nCPU Cores: ${config.cpuCores}`,
            `RAM: ${config.memory} MB`,
            `Video RAM: ${config.vram} MB`,
            `Network adapter mac: ${config.netMacAddress}`,
            `Network interface: ${config.netInterface}`,
        ].join('\n')))
        .catch(e => console.log("Error", e))
})();

