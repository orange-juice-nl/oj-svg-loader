# SVG Loader

## mount
`mount(options?: IOptions): SVGLoader[]`
mounts all html elements containing the `data-svg-loader` attribute that do not contain the `data-loaded` attribute.

```html
<div data-svg-loader="https://url.to/image.svg"></div>
<div data-svg-loader="https://url.to/image.svg" replace></div>
```
```typescript
mount()
```

## constructor
`new SVGLoader(root: HTMLElement, options?: IOptions): SVGLoader`
Load a single SVG.
The SVG is cached. The SVG will only be downloaded once, and shared between any other SVGLoader instance.

```typescript
new SVGLoader(document.querySelector("svg"), { url: "https://url.to/image.svg" })
```

## load
`load(url: string): void`
Replaces the current SVG with the new SVG.