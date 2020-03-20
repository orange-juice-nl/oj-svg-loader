export interface IOptions {
    url?: string;
    replace?: boolean;
}
export declare const getRootElements: <T extends HTMLElement>(selector: string, loaded?: boolean) => T[];
export declare class SVGLoader {
    private static cache;
    root: HTMLElement;
    iframe: HTMLIFrameElement;
    options: IOptions;
    constructor(root: HTMLElement, options?: IOptions);
    private mergeOptions;
    private static load;
}
export declare const mount: () => SVGLoader[];
