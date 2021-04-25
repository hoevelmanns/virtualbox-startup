declare const createImage: (name?: string | undefined, device?: string | undefined) => {
    title: string;
    task: (ctx: any) => Promise<string>;
    options: {
        persistentOutput: boolean;
    };
};
declare const copyImage: (name?: string | undefined, device?: string | undefined) => {
    title: string;
    task: (ctx: any) => Promise<string>;
    options: {
        persistentOutput: boolean;
    };
};
export { createImage, copyImage, };
