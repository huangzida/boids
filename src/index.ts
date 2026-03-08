import Boids from './Boids.vue'
import { meta } from './meta'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

export { Boids, meta }
export type { BoidsProps, BoidsEngineConfig } from './types'

export const locales = {
  en,
  'zh-CN': zhCN,
}
