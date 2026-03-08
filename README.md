# @bg-effects/boids

[English](./README.md) | [简体中文](./README_CN.md)

A high-performance boids simulation background effect built with OGL and Vue.

[Live Demo](https://huangzida.github.io/boids/)

---

### Features

- 🚀 **High Performance**: Built with OGL (a lightweight WebGL library) for smooth rendering of thousands of particles.
- 🐦 **Boids Simulation**: Implements classic flocking behavior (alignment, cohesion, separation).
- 🎨 **Highly Customizable**: Custom modes (organic, swarm), shapes, colors, and trail effects.
- 🖱️ **Interactive**: Supports mouse interaction (attract/repel).
- 🛠️ **Debug Mode**: Built-in visual debug panel for real-time adjustments.
- 📦 **Ready to Use**: Easy-to-use Vue component with simple configuration.

### Installation

```bash
pnpm add @bg-effects/boids ogl
```

> **Note**: `ogl` is a peer dependency and needs to be installed manually.

### Usage

```vue
<script setup>
import { Boids } from '@bg-effects/boids'
</script>

<template>
  <div style="width: 100vw; height: 100vh; background: #000;">
    <Boids 
      :bird-count="100"
      mode="organic"
      color-mode="multi"
    />
  </div>
</template>
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'organic' \| 'swarm'` | `'organic'` | Flocking behavior mode |
| `bird-count` | `number` | `100` | Number of birds |
| `bird-size` | `number` | `2.0` | Size of each bird |
| `speed` | `number` | `1.0` | Movement speed |
| `range` | `number` | `1.0` | Interaction range |
| `alignment` | `number` | `1.0` | Alignment force |
| `cohesion` | `number` | `1.0` | Cohesion force |
| `separation` | `number` | `1.0` | Separation force |
| `perception-radius` | `number` | `50` | Perception radius |
| `interactive` | `boolean` | `true` | Enable mouse interaction |
| `mouse-force` | `number` | `1.0` | Force of mouse interaction |
| `mouse-mode` | `'repel' \| 'attract'` | `'repel'` | Mouse interaction mode |
| `color` | `string` | `'#ffffff'` | Primary bird color |
| `bg-color` | `string` | `'#000000'` | Background color |
| `color-mode` | `'single' \| 'multi'` | `'multi'` | Color mode |
| `shape` | `'triangle' \| 'arrow' \| 'circle'` | `'triangle'` | Bird shape |
| `trail` | `number` | `0.1` | Trail effect intensity (0-1) |
| `debug` | `boolean` | `false` | Enable debug panel |
| `lang` | `'zh-CN' \| 'en'` | `'zh-CN'` | UI language |

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### License

MIT
