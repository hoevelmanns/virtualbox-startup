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
    wifiAuth?: { ssid: string, password: string }
}

export type WifiAuth = { ssid: string, password: string }

export type Ctx = {
    config: Config
    wifiAuth?: WifiAuth
    hasWifi: boolean,
    wifiIsConnected: boolean,
    netIsUp: boolean
}

export type Graphics = {
    controllers: [{
        model: string,
        vendor: string,
        vram: number,
    }]
}
