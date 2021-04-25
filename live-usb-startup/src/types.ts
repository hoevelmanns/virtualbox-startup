export type Machine = { name: string, running: boolean }
export type Machines = { [key: string]: Machine }
export type ConfigValues = { [key: string]: any }
export type NetworkInterface = {
    iface: string,
    ifaceName: string,
    ip4: string,
    mac: string,
    operstate: string,
    type: 'wireless' | 'virtual'
}

export type Memory = {
    total: number,
    free: number,
    used: number,
    active: number,
    available: number
}

export type CpuInfo = {
    processors: number,
    cores: number,
    brand: string,
    manufacturer: string,
    virtualization: boolean
}

export type Config = {
    netMacAddress: string,
    netInterface: string,
    cpuCores: string,
    memory: string,
    vram: string,
    vtxux: string,
}

export type Ctx = {
    vmConfig: Config
}

export type Graphics = {
    controllers: [{
        model: string,
        vendor: string,
        vram: number,
    }]
}
