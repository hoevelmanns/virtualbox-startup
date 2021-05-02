import {execSync, spawnSync} from 'child_process'
import {
    Config,
    ConfigValues,
    CpuInfo,
    Ctx,
    Graphics,
    NetworkInterface,
    WifiAuth,
    OS,
} from './types'
import delay from "delay"
import chalk from "chalk"
import {readJsonSync, writeJsonSync} from "fs-extra"
import {TaskWrapper} from "listr2/dist/lib/task-wrapper"

export const sysinfo = require('systeminformation')

const wifi = require('node-wifi')

const cpu: Promise<CpuInfo> = sysinfo.cpu()

const graphics: Promise<Graphics> = sysinfo.graphics()

const os: Promise<OS> = sysinfo.osInfo()

const randomMacAddress = require('random-mac')().split(':').join('')

export const init = (configFile: string) => {
    wifi.init({iface: null})
    return readJsonSync(configFile, {throws: false}) ?? {}
}

export const saveConfig = (configFile: string, config: Config) => writeJsonSync(configFile, config)

const setExtraData = (vm: string, name: string, value: string) =>
    spawnSync('VBoxManage', ['setextradata', vm, name, value]);

export const activeNetworkInterface = () =>
    sysinfo.networkInterfaces().then((interfaces: NetworkInterface[]): NetworkInterface | undefined =>
        interfaces.find((i: any) => i.operstate === 'up'))

export const startVm = (vm: string) => execSync(`VBoxManage startvm ${vm}`)

export const setExtraDataConfig = (vm: string, config: ConfigValues) =>
    Object.entries(config).map(([name, value]) => setExtraData(vm, name, value.toString()))

export const setupWifi = async (ctx: Ctx, task: TaskWrapper<Ctx, never>) =>
    wifi.scan().then(async (networks: { ssid: string }[]) =>
        await task.prompt<WifiAuth>([
            {
                type: 'Select',
                name: 'ssid',
                message: 'Select your Wifi-Network',
                choices: networks.filter((network: any) => network.ssid.length > 0).map((network: any) => network.ssid)
            },
            {
                type: 'Password',
                name: 'password',
                message: 'Please enter the Wifi-Key:'
            }
        ]).then((auth: WifiAuth) => wifi.connect(auth)
            .then(() => {
                ctx.wifiAuth = auth
                ctx.netIsUp = true
            })
            .catch(async () => {
                await delay(1000)
                ctx.netIsUp = false
                throw new Error(chalk.red.bold('Wrong Wifi credentials'))
            })))

const vmMemory = async (): Promise<number> => {
    const memory = await sysinfo.mem()
    const {total, available} = memory
    const recommendedMem = total * 0.5 / Math.pow(1024, 2)
    return Math.round(recommendedMem <= available ? recommendedMem : available * 0.7)
}

export const setVmHardware = async (vm: string, ctx: Ctx): Promise<Config> => {
    const config = {
        netMacAddress: ctx.config.netMacAddress ?? randomMacAddress,
        netInterface: (await activeNetworkInterface())?.iface ?? 'unknown',
        cpuCores: ((await cpu).cores / 2),
        vtxux: ((await cpu)).virtualization ? 'on' : 'off',
        memory: (await vmMemory()),
        vram: Math.round(((await graphics)).controllers[0].vram),
        wifiAuth: ctx.wifiAuth,
    }

    spawnSync('VBoxManage', ['modifyvm', vm,
        '--nic1', 'bridged', '--nictype1', '82545EM', '--bridgeadapter1', config.netInterface,
        '--macaddress1', config.netMacAddress,
        '--cpus', config.cpuCores.toString(),
        '--memory', config.memory.toString(),
        '--vram', config.vram.toString(),
        '--vtxux', config.vtxux,
        '--nestedpaging', config.vtxux,
        '--pae', config.vtxux,
        '--paravirtprovider', (await (os))?.hypervisor ? 'hyperv' : 'default',
        '--accelerate3d', 'on' // The Guest Additions must be installed
    ])
    return config
}
