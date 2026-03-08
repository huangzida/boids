export interface BoidsProps {
  debug?: boolean
  lang?: 'zh-CN' | 'en'
  className?: string
  mode?: 'organic' | 'swarm'
  birdCount?: number
  birdSize?: number
  speed?: number
  range?: number
  alignment?: number
  cohesion?: number
  separation?: number
  perceptionRadius?: number
  interactive?: boolean
  mouseForce?: number
  mouseMode?: 'repel' | 'attract'
  color?: string
  bgColor?: string
  colorMode?: 'single' | 'multi'
  shape?: 'triangle' | 'arrow' | 'circle'
  trail?: number
}

export interface BoidsEngineConfig {
  mode: 'organic' | 'swarm'
  birdCount: number
  birdSize: number
  speed: number
  range: number
  alignment: number
  cohesion: number
  separation: number
  perceptionRadius: number
  interactive: boolean
  mouseForce: number
  mouseMode: 'repel' | 'attract'
  color: string
  bgColor: string
  colorMode: 'single' | 'multi'
  shape: 'triangle' | 'arrow' | 'circle'
  trail: number
}
