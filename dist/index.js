"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootElements = function (selector, loaded) {
    if (loaded === void 0) { loaded = false; }
    var elements = Array.from(document.querySelectorAll(selector));
    if (loaded) {
        elements = elements.filter(function (x) { return x.getAttribute("data-loaded") !== null; });
        elements.forEach(function (x) { return x.setAttribute("data-loaded", "loaded"); });
    }
    return elements;
};
var SVGLoader = /** @class */ (function () {
    function SVGLoader(root, options) {
        var _this = this;
        this.options = {};
        this.root = root;
        this.mergeOptions(options);
        SVGLoader.load(this.options.url)
            .then(function (svg) {
            _this.root[_this.options.replace ? "outerHTML" : "innerHTML"] = svg;
        });
    }
    SVGLoader.prototype.mergeOptions = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        Object.assign(this.options, options);
        var elOptions = {
            url: this.root.getAttribute("data-svg-loader"),
            replace: this.root.getAttribute("replace")
        };
        Object.entries(elOptions)
            .filter(function (_a) {
            var k = _a[0], v = _a[1];
            return v;
        })
            .forEach(function (_a) {
            var k = _a[0], v = _a[1];
            return _this.options[k] = v;
        });
    };
    SVGLoader.load = function (url) {
        return new Promise(function (r) {
            if (!SVGLoader.cache[url])
                SVGLoader.cache[url] = { svg: null, cb: [] };
            var c = SVGLoader.cache[url];
            if (!c.svg) {
                if (c.cb.length === 0) {
                    var xhr_1 = new XMLHttpRequest();
                    xhr_1.open("GET", url, true);
                    xhr_1.onload = function () {
                        return xhr_1.status === 200
                            ? c.cb.forEach(function (x) { return x(xhr_1.responseText); })
                            : undefined;
                    };
                    xhr_1.send();
                }
                c.cb.push(r);
            }
            else
                r(c.svg);
        });
    };
    SVGLoader.cache = {};
    return SVGLoader;
}());
exports.SVGLoader = SVGLoader;
exports.mount = function () {
    return exports.getRootElements("[data-svg-loader]", true)
        .map(function (x) { return new SVGLoader(x); });
};
