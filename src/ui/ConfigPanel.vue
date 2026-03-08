<script setup lang="ts">
import { computed, ref } from 'vue'
import { ColorPicker, Slider, Toggle, ButtonGroup, SubTabs } from '@bg-effects/shared'
import en from '../locales/en.json'
import zhCN from '../locales/zh-CN.json'
import type { BoidsProps } from '../types'

const props = defineProps<{
  lang?: 'zh-CN' | 'en'
}>()

const config = defineModel<BoidsProps>('config', { required: true })
const activeTab = ref<'basic' | 'behavior' | 'appearance' | 'interaction'>('basic')

const i18n: Record<string, any> = {
  en,
  'zh-CN': zhCN,
}

const t = (path: string) => {
  const dict = i18n[props.lang || 'zh-CN']
  return path.split('.').reduce((obj: any, key) => obj?.[key], dict) || path
}

const tabs = computed(() => [
  { id: 'basic', label: t('tabs.basic') },
  { id: 'behavior', label: t('tabs.behavior') },
  { id: 'appearance', label: t('tabs.appearance') },
  { id: 'interaction', label: t('tabs.interaction') },
])

const modeOptions = computed(() => [
  { value: 'organic', label: t('labels.mode_organic') },
  { value: 'swarm', label: t('labels.mode_swarm') },
])

const shapeOptions = computed(() => [
  { value: 'triangle', label: t('labels.shape_triangle') },
  { value: 'arrow', label: t('labels.shape_arrow') },
  { value: 'circle', label: t('labels.shape_circle') },
])

const colorModeOptions = computed(() => [
  { value: 'single', label: t('labels.color_mode_single') },
  { value: 'multi', label: t('labels.color_mode_multi') },
])

const mouseModeOptions = computed(() => [
  { value: 'repel', label: t('labels.mouse_mode_repel') },
  { value: 'attract', label: t('labels.mouse_mode_attract') },
])

defineExpose({
  activeTab,
})
</script>

<template>
  <div class="flex flex-col gap-6 text-white/90">
    <SubTabs v-model="activeTab" :tabs="tabs" />

    <div class="flex flex-col gap-6 p-1 pointer-events-auto overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
      <!-- Basic Tab -->
      <div v-if="activeTab === 'basic'" class="flex flex-col gap-6">
        <ButtonGroup
          v-model="config.mode"
          :label="t('labels.mode')"
          :options="modeOptions"
          :columns="2"
          layout="horizontal"
        />
        
        <ButtonGroup
          v-model="config.shape"
          :label="t('labels.shape')"
          :options="shapeOptions"
          :columns="3"
          layout="horizontal"
        />

        <Slider
          v-model="config.birdCount"
          :label="t('labels.count')"
          :min="10"
          :max="1000"
          :step="10"
        />

        <Slider
          v-model="config.birdSize"
          :label="t('labels.bird_size')"
          :min="0.5"
          :max="10"
          :step="0.1"
        />

        <Slider
          v-model="config.speed"
          :label="t('labels.speed')"
          :min="0.1"
          :max="5"
          :step="0.1"
          suffix="x"
        />

        <Slider
          v-model="config.range"
          :label="t('labels.range')"
          :min="1"
          :max="3"
          :step="0.1"
        />
      </div>

      <!-- Behavior Tab -->
      <div v-if="activeTab === 'behavior'" class="flex flex-col gap-6">
        <Slider
          v-model="config.alignment"
          :label="t('labels.alignment')"
          :min="0"
          :max="2"
          :step="0.1"
        />
        <Slider
          v-model="config.cohesion"
          :label="t('labels.cohesion')"
          :min="0"
          :max="2"
          :step="0.1"
        />
        <Slider
          v-model="config.separation"
          :label="t('labels.separation')"
          :min="0"
          :max="2"
          :step="0.1"
        />
        <Slider
          v-model="config.perceptionRadius"
          :label="t('labels.perception')"
          :min="10"
          :max="200"
          :step="1"
        />
      </div>

      <!-- Appearance Tab -->
      <div v-if="activeTab === 'appearance'" class="flex flex-col gap-6">
        <ButtonGroup
          v-model="config.colorMode"
          :label="t('labels.color_mode')"
          :options="colorModeOptions"
          :columns="2"
          layout="horizontal"
        />
        
        <div v-if="config.colorMode === 'single'" class="grid grid-cols-2 gap-4">
          <ColorPicker
            v-model="config.color"
            :label="t('labels.color')"
          />
          <ColorPicker
            v-model="config.bgColor"
            :label="t('labels.bg_color')"
          />
        </div>
        <div v-else>
          <ColorPicker
            v-model="config.bgColor"
            :label="t('labels.bg_color')"
          />
        </div>
      </div>

      <!-- Interaction Tab -->
      <div v-if="activeTab === 'interaction'" class="flex flex-col gap-6">
        <Toggle
          v-model="config.interactive"
          :label="t('labels.interactive')"
        />
        
        <div v-if="config.interactive" class="flex flex-col gap-6">
          <ButtonGroup
            v-model="config.mouseMode"
            :label="t('labels.mouse_mode')"
            :options="mouseModeOptions"
            :columns="2"
            layout="horizontal"
          />
          <Slider
            v-model="config.mouseForce"
            :label="t('labels.mouse_force')"
            :min="0"
            :max="10"
            :step="0.1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
