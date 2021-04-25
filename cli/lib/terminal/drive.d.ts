declare const selectDrive: () => {
    title: string;
    task: (ctx: any, task: any) => Promise<void>;
    options: {
        persistentOutput: boolean;
    };
};
declare const createDrive: () => {
    title: string;
    task: (ctx: any, task: any) => Promise<any>;
    options: {
        persistentOutput: boolean;
    };
};
export { selectDrive, createDrive, };
