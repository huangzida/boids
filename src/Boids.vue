<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { DebugShell } from '@bg-effects/debug-ui'
import { defu } from 'defu'
import { meta } from './meta'
import type { BoidsProps, BoidsEngineConfig } from './types'
import { BoidsEngine } from './engine/BoidsEngine'
import ConfigPanel from './ui/ConfigPanel.vue'

const props = defineProps<BoidsProps>()

const config = ref<BoidsProps>(defu(props, meta.defaultConfig) as BoidsProps)
const internalLang = ref<'zh-CN' | 'en'>(config.value.lang || 'zh-CN')

watch(() => props, (newProps) => {
  if (!props.debug) {
    config.value = defu(newProps, meta.defaultConfig) as BoidsProps
  }
}, { deep: true })

const containerRef = ref<HTMLElement | null>(null)
let engine: BoidsEngine | null = null

const engineInterface = computed(() => ({
  pause: () => engine?.pause(),
  resume: () => engine?.resume(),
  restart: () => engine?.restart(),
}))

const configPanelRef = ref<{ activeTab: string } | null>(null)

const handleRandomize = () => {
  if (meta.randomize) {
    const randomized = meta.randomize(config.value, configPanelRef.value?.activeTab)
    config.value = {
      ...randomized,
      debug: config.value.debug,
      lang: config.value.lang,
    }
  }
}

const effectiveConfig = computed(() => (props.debug ? config.value : props))

const resolveEngineConfig = (source: BoidsProps): BoidsEngineConfig => ({
  mode: source.mode ?? meta.defaultConfig.mode!,
  birdCount: source.birdCount ?? meta.defaultConfig.birdCount!,
  birdSize: source.birdSize ?? meta.defaultConfig.birdSize!,
  speed: source.speed ?? meta.defaultConfig.speed!,
  range: source.range ?? meta.defaultConfig.range!,
  alignment: source.alignment ?? meta.defaultConfig.alignment!,
  cohesion: source.cohesion ?? meta.defaultConfig.cohesion!,
  separation: source.separation ?? meta.defaultConfig.separation!,
  perceptionRadius: source.perceptionRadius ?? meta.defaultConfig.perceptionRadius!,
  interactive: source.interactive ?? meta.defaultConfig.interactive!,
  mouseForce: source.mouseForce ?? meta.defaultConfig.mouseForce!,
  mouseMode: source.mouseMode ?? meta.defaultConfig.mouseMode!,
  color: source.color ?? meta.defaultConfig.color!,
  bgColor: source.bgColor ?? meta.defaultConfig.bgColor!,
  colorMode: source.colorMode ?? meta.defaultConfig.colorMode!,
  shape: source.shape ?? meta.defaultConfig.shape!,
  trail: source.trail ?? meta.defaultConfig.trail!,
})

watch(effectiveConfig, (newConfig) => {
  if (!engine) return
  engine.updateConfig(resolveEngineConfig(defu(newConfig, meta.defaultConfig) as BoidsProps))
}, { deep: true })

onMounted(() => {
  if (!containerRef.value) return
  const resolved = defu(effectiveConfig.value, meta.defaultConfig) as BoidsProps
  engine = new BoidsEngine(containerRef.value, resolveEngineConfig(resolved))
})

onUnmounted(() => {
  engine?.destroy()
  engine = null
})
</script>

<template>
  <div ref="containerRef" :class="['relative w-full h-full overflow-hidden', className]" :style="{ backgroundColor: config.bgColor }">
    <DebugShell
      v-if="debug"
      v-model:config="config"
      v-model:lang="internalLang"
      :meta="meta"
      :engine="engineInterface"
      @randomize="handleRandomize"
    >
      <template #settings>
        <ConfigPanel ref="configPanelRef" v-model:config="config" :lang="internalLang" />
      </template>
    </DebugShell>
  </div>
</template>
