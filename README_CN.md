# @bg-effects/boids

[English](./README.md) | [简体中文](./README_CN.md)

基于 OGL 和 Vue 构建的高性能 Boids（鸟群/群体行为）背景模拟特效。

[在线演示](https://huangzida.github.io/boids/)

---

### 特性

- 🚀 **高性能**: 基于 OGL (轻量级 WebGL 库) 构建，可流畅渲染数千个粒子。
- 🐦 **群体行为模拟**: 实现了经典的 Boids 算法（对齐、凝聚、分离）。
- 🎨 **高度可定制**: 支持自定义模式（organic、swarm）、形状、颜色及尾迹效果。
- �️ **交互性**: 支持鼠标交互（排斥/吸引）。
- �🛠️ **调试模式**: 内置可视化调试面板，方便实时调整效果。
- 📦 **开箱即用**: 作为 Vue 组件，简单配置即可使用。

### 安装

```bash
pnpm add @bg-effects/boids ogl
```

> **注意**: `ogl` 是 peer dependency，需要手动安装。

### 使用

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

### 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `mode` | `'organic' \| 'swarm'` | `'organic'` | 群体行为模式 |
| `bird-count` | `number` | `100` | 鸟的数量 |
| `bird-size` | `number` | `2.0` | 每个鸟的大小 |
| `speed` | `number` | `1.0` | 移动速度 |
| `range` | `number` | `1.0` | 交互范围 |
| `alignment` | `number` | `1.0` | 对齐力 |
| `cohesion` | `number` | `1.0` | 凝聚力 |
| `separation` | `number` | `1.0` | 分离力 |
| `perception-radius` | `number` | `50` | 感知半径 |
| `interactive` | `boolean` | `true` | 是否开启鼠标交互 |
| `mouse-force` | `number` | `1.0` | 鼠标交互力强度 |
| `mouse-mode` | `'repel' \| 'attract'` | `'repel'` | 鼠标交互模式（排斥/吸引） |
| `color` | `string` | `'#ffffff'` | 鸟的基础颜色 |
| `bg-color` | `string` | `'#000000'` | 背景颜色 |
| `color-mode` | `'single' \| 'multi'` | `'multi'` | 颜色模式 |
| `shape` | `'triangle' \| 'arrow' \| 'circle'` | `'triangle'` | 鸟的形状 |
| `trail` | `number` | `0.1` | 尾迹效果强度 (0-1) |
| `debug` | `boolean` | `false` | 是否开启调试面板 |
| `lang` | `'zh-CN' \| 'en'` | `'zh-CN'` | 界面语言 |

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发环境
pnpm dev
```

### 许可

MIT
