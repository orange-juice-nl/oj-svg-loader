export interface IOptions {
  url?: string
  replace?: boolean
}

export const getRootElements = <T extends HTMLElement>(selector: string, loaded: boolean = false) => {
  let elements = (Array.from(document.querySelectorAll(selector)) as T[])
  if (loaded) {
    elements = elements.filter(x => x.getAttribute("data-loaded") !== null)
    elements.forEach(x => x.setAttribute("data-loaded", "loaded"))
  }
  return elements
}

export class SVGLoader {
  private static cache: { [url: string]: { cb: Function[], svg?: null | string } } = {}
  root: HTMLElement
  iframe: HTMLIFrameElement
  options: IOptions = {}

  constructor(root: HTMLElement, options?: IOptions) {
    this.root = root
    this.mergeOptions(options)
    SVGLoader.load(this.options.url)
      .then(svg => {
        this.root[this.options.replace ? "outerHTML" : "innerHTML"] = svg
      })
  }

  private mergeOptions(options: IOptions = {}) {
    Object.assign(this.options, options)
    const elOptions = {
      url: this.root.getAttribute("data-svg-loader"),
      replace: this.root.getAttribute("replace")
    }
    Object.entries(elOptions)
      .filter(([k, v]) => v)
      .forEach(([k, v]) => this.options[k] = v)
  }

  private static load(url: string) {
    return new Promise<string>(r => {
      if (!SVGLoader.cache[url])
        SVGLoader.cache[url] = { svg: null, cb: [] }

      const c = SVGLoader.cache[url]
      if (!c.svg) {
        if (c.cb.length === 0) {
          const xhr = new XMLHttpRequest()
          xhr.open("GET", url, true)
          xhr.onload = () =>
            xhr.status === 200
              ? c.cb.forEach(x => x(xhr.responseText))
              : undefined
          xhr.send()
        }
        c.cb.push(r)
      }
      else
        r(c.svg)
    })
  }
}

export const mount = () =>
  getRootElements("[data-svg-loader]", true)
    .map(x => new SVGLoader(x as HTMLElement))