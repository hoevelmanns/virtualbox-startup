import {spawnSync} from 'child_process'
import {Config, ConfigValues, CpuInfo, Graphics, Machines, Memory, NetworkInterface} from './types'

const sysinfo = require('systeminformation')
const activeNetworkInterface: Promise<NetworkInterface> =
    sysinfo.networkInterfaces().then((interfaces: NetworkInterface[]): NetworkInterface | undefined =>
        interfaces.find((i: any) => i.operstate === 'up'))

const cpu: Promise<CpuInfo> = sysinfo.cpu()

const memory: Promise<Memory> = sysinfo.mem()

const graphics: Promise<Graphics> = sysinfo.graphics()

const randomMacAddress = require('random-mac')().split(':').join('')

export const vmExists = (vm: string, machines: Machines) =>
    Object.values(machines).filter(m => m.name === vm).length > 0

export const startVm = (vm: string) => spawnSync('VBoxManage', ['startvm', vm])

export const setExtraData = (vm: string, name: string, value: string) =>
    spawnSync('VBoxManage', ['setextradata', vm, name, value]);

export const setExtraDataConfig = (vm: string, config: ConfigValues) =>
    Object.entries(config).map(([name, value]) => setExtraData(vm, name, value.toString()))

export const setNetworkAdapter = (vm: string, type: string) =>
    spawnSync('VBoxManage', ['modifyvm', vm, '--bridgeadapter1', type])

export const setVmHardware = async (vm: string): Promise<Config> => {
    const vmConfig = {
        netMacAddress: randomMacAddress,
        netInterface: (await activeNetworkInterface).iface,
        cpuCores: ((await cpu).cores / 2).toString(),
        vtxux: ((await cpu)).virtualization ? 'on' : 'off',
        memory: Math.round(((await memory)).available / (1024 * 1024) - 1000).toString(),
        vram: Math.round(((await graphics)).controllers[0].vram).toString()
    }

    spawnSync('VBoxManage', ['modifyvm', vm,
        '--nic1', 'bridged', '--nictype1', '82545EM', '--bridgeadapter1', vmConfig.netInterface,
        '--macaddress1', vmConfig.netMacAddress,
        '--cpus', vmConfig.cpuCores,
        '--memory', vmConfig.memory,
        '--vram', vmConfig.vram,
        '--vtxux', vmConfig.vtxux
    ])
    return vmConfig
}
