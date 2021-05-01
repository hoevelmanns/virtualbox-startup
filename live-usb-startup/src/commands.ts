import {exec, execSync, spawnSync} from 'child_process'
import {Config, ConfigValues, CpuInfo, Ctx, Graphics, Machines, Memory, NetworkInterface, WifiAuth} from './types'
import {Systeminformation} from "systeminformation"
import WifiNetworkData = Systeminformation.WifiNetworkData
import delay from "delay"
import chalk from "chalk"
import {readJsonSync, writeJsonSync} from "fs-extra"
import {TaskWrapper} from "listr2/dist/lib/task-wrapper"

export const sysinfo = require('systeminformation')

const wifi = require('node-wifi')

const cpu: Promise<CpuInfo> = sysinfo.cpu()

const memory: Promise<Memory> = sysinfo.mem()

const graphics: Promise<Graphics> = sysinfo.graphics()

const randomMacAddress = require('random-mac')().split(':').join('')

export const init = (configFile: string) => {
    wifi.init({iface: null})
    return readJsonSync(configFile, {throws: false}) ?? {}
}

export const saveConfig = (configFile: string, config: Config) =>  writeJsonSync(configFile, config)

const setExtraData = (vm: string, name: string, value: string) =>
    spawnSync('VBoxManage', ['setextradata', vm, name, value]);

export const activeNetworkInterface = () =>
    sysinfo.networkInterfaces().then((interfaces: NetworkInterface[]): NetworkInterface | undefined =>
        interfaces.find((i: any) => i.operstate === 'up'))

export const getWifiNetworks = (): Promise<any> =>
    sysinfo.wifiNetworks().then((wifis: WifiNetworkData[]) => wifis.map(w => w.ssid))

export const vmExists = (vm: string, machines: Machines) =>
    Object.values(machines).filter(m => m.name === vm).length > 0

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

export const setVmHardware = async (vm: string, ctx: Ctx): Promise<Config> => {
    const config = {
        netMacAddress: ctx.config.netMacAddress ?? randomMacAddress,
        netInterface: (await activeNetworkInterface())?.iface ?? 'unknown',
        cpuCores: ((await cpu).cores / 2).toString(),
        vtxux: ((await cpu)).virtualization ? 'on' : 'off',
        memory: Math.round(((await memory)).available * 0.9 / (1024 * 1024)).toString(),
        vram: Math.round(((await graphics)).controllers[0].vram).toString(),
        wifiAuth: ctx.wifiAuth
    }

    spawnSync('VBoxManage', ['modifyvm', vm,
        '--nic1', 'bridged', '--nictype1', '82545EM', '--bridgeadapter1', config.netInterface,
        '--macaddress1', config.netMacAddress,
        '--cpus', config.cpuCores,
        '--memory', config.memory,
        '--vram', config.vram,
        '--vtxux', config.vtxux
    ])
    return config
}
