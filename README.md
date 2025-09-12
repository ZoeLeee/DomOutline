# DomOutline (theroomjs)
> A TypeScript-powered vanilla JavaScript plugin that allows you to outline DOM elements like web inspectors.

[![Downloads](https://img.shields.io/npm/dm/dom-outline.svg)](https://npmjs.com/dom-outline)
[![install size](https://packagephobia.com/badge?p=dom-outline)](https://packagephobia.com/result?p=dom-outline)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

`DomOutline` (formerly `theroomjs`) is a modern, TypeScript-first library that provides DOM element inspection capabilities. It can be accessed globally as `theRoom` and is compatible with modern browsers including Google Chrome, Mozilla Firefox, Safari, Edge, and Internet Explorer.

## ✨ Features

- 🎯 **TypeScript Support**: Full type definitions and IntelliSense support
- 🚀 **Modern Build**: Built with Vite for optimal performance
- 📦 **Multiple Formats**: ES modules, UMD, and IIFE support
- 🎨 **Customizable**: Extensive configuration options
- 🔧 **Event System**: Rich event handling for user interactions
- 🖼️ **Iframe Support**: Works across iframe boundaries
- 📱 **Cross-browser**: Compatible with all modern browsers

## 📦 Install

```bash
npm install dom-outline --save
```

## 🚀 Quick Start

### TypeScript/ES Modules

```typescript
import theRoom, { TheRoomOptions } from 'dom-outline';

const options: TheRoomOptions = {
  createInspector: true,
  blockRedirection: true,
  excludes: ['footer', '.no-inspect'],
  click: (target, event, originTarget, depth) => {
    console.log('Element clicked:', target?.tagName);
  }
};

theRoom.start(options);
```

### Browser (UMD)

```html
<script src="node_modules/dom-outline/dist/index.umd.js"></script>
<script>
  // Setup/configure theRoom before inspection
  window.theRoom.configure({
    inspector: '.inspector-element',
    blockRedirection: true,
    excludes: ['footer'],
    click: function (element) {
      console.log('element is clicked:', element);
    }
  });

  // Start inspection
  window.theRoom.start();

  // Dynamically bind event
  window.theRoom.on('mousemove', function (element) {
    console.log('the element is hovered', element);
  });

  // Stop inspection and reset inspector styles
  window.theRoom.stop(true);
</script>
```

## ⚙️ Configuration Options

| Name              | Type                     | Default    | Description                                                  |
| ---               | ---                      | ---        | ---                                                          |
| `inspector`       | `string \| HTMLElement`  | -          | Placeholder element for inspection. It will not be inspected |
| `createInspector` | `boolean`                | `false`    | If `true` and inspector option is not provided, theRoom will create an inspector element with class `inspector-element` and append it to `<body/>` |
| `htmlClass`       | `boolean`                | `true`     | If `true` theRoom's namespace will be automatically added to `<html/>` element class list |
| `blockRedirection`| `boolean`                | `false`    | If `true` the page will not be redirected elsewhere. theRoom will override `onbeforeunload` to do that |
| `excludes`        | `string[]`               | -          | Elements that are excluded from inspection. Basic CSS selectors are allowed |

## 🎯 Events

| Name       | Description                                              | Parameters |
| ---        | ---                                                      | ---        |
| `starting` | Fired when inspection is being started                   | `target`, `event`, `originTarget`, `depth` |
| `started`  | Fired when inspection is started                         | `target`, `event`, `originTarget`, `depth` |
| `stopping` | Fired when inspection is being stopped                   | `target`, `event`, `originTarget`, `depth` |
| `stopped`  | Fired when inspection is stopped                         | `target`, `event`, `originTarget`, `depth` |
| `click`    | Fired when the inspected element is clicked              | `target`, `event`, `originTarget`, `depth` |
| `mousemove`| Fired when the inspected element is hovered              | `target`, `event`, `originTarget`, `depth` |
| `keydown`  | Fired when a key is pressed during inspection            | `target`, `event`, `originTarget`, `depth` |
| `keyup`    | Fired when a key is released during inspection           | `target`, `event`, `originTarget`, `depth` |
| `mousedown`| Fired when mouse button is pressed on inspected element  | `target`, `event`, `originTarget`, `depth` |
| `hook`     | Fired before `click` and `mousemove` events. Returns `false` to prevent event emission | `event` |

> Events can also be defined in options or bound dynamically using the `on()` method.

## 🔧 API Reference

### TheRoomAPI

| Method      | Type     | Parameters                          | Description                                               |
| ---         | ---      | ---                                 | ---                                                       |
| `start`     | function | `options?` (optional)               | Start inspection with optional configuration              |
| `stop`      | function | `resetInspector?` (optional)        | Stop inspection and optionally reset inspector styles    |
| `check`     | function | `el: HTMLElement \| HTMLElement[]`  | Manually check specific elements                         |
| `highLight` | function | `color?` (optional)                 | Highlight inspected elements with custom color           |
| `cancelHighLight` | function | -                               | Cancel element highlighting                              |
| `on`        | function | `name: string`, `handler: Function` | Dynamically bind event handlers                          |
| `configure` | function | `options: TheRoomOptions`           | Override theRoom options anytime                         |
| `status`    | function | -                                   | Get inspection engine status (`idle`, `running`, `stopped`) |

### TypeScript Types

```typescript
interface TheRoomOptions {
  inspector?: string | HTMLElement;
  htmlClass?: boolean;
  blockRedirection?: boolean;
  createInspector?: boolean;
  excludes?: string[];
  starting?: EventHandler;
  started?: EventHandler;
  stopping?: EventHandler;
  stopped?: EventHandler;
  click?: EventHandler;
  mousemove?: EventHandler;
  keydown?: EventHandler;
  keyup?: EventHandler;
  mousedown?: EventHandler;
  hook?: HookEventHandler;
}

type Status = 'idle' | 'running' | 'stopped';
type EventHandler = (target?: HTMLElement, event?: Event, originTarget?: HTMLElement, depth?: number) => void | boolean;
type HookEventHandler = (event: Event) => boolean | void;
```

## 🎮 Examples

Check out the comprehensive examples in the `examples/` directory:

- **Basic Usage**: Simple DOM inspection setup
- **Advanced Configuration**: Complex configuration scenarios
- **Event Handling**: Custom event handlers and hooks
- **Iframe Support**: Cross-frame DOM inspection
- **Custom Inspector**: Custom inspector element implementation

Run examples locally:
```bash
npm run examples
```

## 🛠️ Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup
```bash
git clone https://github.com/ZoeLeee/DomOutline.git
cd DomOutline
npm install
```

### Build
```bash
# Build JavaScript and TypeScript declarations
npm run build

# Build only JavaScript
npm run build:js

# Build only TypeScript declarations
npm run build:types

# Type checking
npm run type-check
```

### Development Server
```bash
# Start development server for examples
npm run examples

# Preview built examples
npm run examples:preview
```

## 📁 Project Structure

```
src/
├── types.ts          # TypeScript type definitions
├── theroom.ts        # Core TheRoom class implementation
├── browser.ts        # Browser-compatible IIFE wrapper
└── main.ts           # ES module entry point

dist/
├── index.es.js       # ES module build
├── index.umd.js      # UMD build
├── index.d.ts        # Main TypeScript declarations
├── types.d.ts        # Type definitions
└── *.d.ts.map        # Source maps for declarations

examples/
├── basic/            # Basic usage example
├── advanced/         # Advanced configuration
├── events/           # Event handling examples
├── iframe/           # Iframe support examples
└── custom/           # Custom inspector examples
```

## 🔄 Migration from v1.x

If you're upgrading from the original `theroomjs` or `dom-outline` v1.x:

1. **Package name**: The package is now `dom-outline` (previously `theroomjs`) and the library is called `DomOutline`
2. **TypeScript support**: Full type definitions are now available
3. **Build system**: Now uses Vite instead of Gulp for better performance
4. **Event names**: `mouseover` event is now `mousemove` for consistency
5. **Import syntax**: ES modules are now the recommended approach

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [path-finder](https://github.com/hsynlms/path-finder) - A Chrome extension to inspect and find out an HTML element unique CSS selector
- [dom-inspector](https://github.com/GoogleChrome/devtools-frontend) - Chrome DevTools DOM inspector implementation

---

**Note**: This project was originally known as `theroomjs` and is now published as `dom-outline`. It has been modernized with TypeScript support and improved build tooling while maintaining backward compatibility.