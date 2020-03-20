export interface iOptions {
}
export default class SVGLoader {
    private root;
    private url;
    static mount(): SVGLoader[];
    constructor(root: HTMLElement);
    static load(target: HTMLElement, url: string): Promise<void>;
}
