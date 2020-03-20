export default class SVGLoader {
    private static cache;
    private root;
    private url;
    static mount(): SVGLoader[];
    constructor(root: HTMLElement);
    static load(target: HTMLElement, url: string): void;
    private static getCache(url);
    private static setCache(url, data?);
}
