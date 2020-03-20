var SVGLoader = /** @class */ (function () {
    function SVGLoader(root) {
        this.root = root;
        this.url = this.root.getAttribute("data-svg-loader");
        SVGLoader.load(this.root, this.url);
        this.root.setAttribute("data-svg-loader", "loaded");
    }
    SVGLoader.mount = function () {
        return Array.from(document.querySelectorAll("[data-svg-loader]:not([data-svg-loader=\"loaded\"])")).map(function (x) { return new SVGLoader(x); });
    };
    SVGLoader.load = function (target, url) {
        var cached = SVGLoader.getCache(url);
        if (cached.svg)
            target.innerHTML = cached.svg;
        else {
            cached.cb.push(function (svg) { return target.innerHTML = svg; });
            if (cached.svg !== null) {
                SVGLoader.setCache(url, null);
                var xhr_1 = new XMLHttpRequest();
                xhr_1.open('GET', url, true);
                xhr_1.onload = function () { if (xhr_1.status === 200)
                    SVGLoader.setCache(url, xhr_1.responseText); };
                xhr_1.send();
            }
        }
    };
    SVGLoader.getCache = function (url) {
        if (SVGLoader.cache[url] === undefined)
            SVGLoader.cache[url] = { cb: [] };
        return SVGLoader.cache[url];
    };
    SVGLoader.setCache = function (url, data) {
        var cache = SVGLoader.getCache(url);
        if (typeof data === "string") {
            cache.svg = data;
            cache.cb.forEach(function (x) { return x(data); });
        }
        return cache;
    };
    SVGLoader.cache = {};
    return SVGLoader;
}());
export default SVGLoader;
