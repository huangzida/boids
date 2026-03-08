import { hit, rand, sample } from '@bg-effects/shared'
import type { EffectMeta } from '@bg-effects/core'
import type { BoidsProps } from './types'

export const meta: EffectMeta<BoidsProps> = {
  id: 'boids',
  name: {
    en: 'Boids Flock',
    'zh-CN': '飞鸟集群'
  },
  category: 'nature',
  version: '1.0.0',
  defaultConfig: {
    debug: false,
    lang: 'zh-CN',
    mode: 'organic',
    birdCount: 200,
    birdSize: 2.5,
    speed: 1.0,
    range: 1,
    alignment: 1.0,
    cohesion: 1.0,
    separation: 1.2,
    perceptionRadius: 50,
    interactive: true,
    mouseForce: 1.0,
    mouseMode: 'repel',
    color: '#ffffff',
    bgColor: '#020617',
    colorMode: 'single',
    shape: 'triangle',
    trail: 0.1,
  },
  randomize: (current, tab) => {
    const colors = [
      '#ffffff',
      '#7aa2f7',
      '#bb9af7',
      '#7dcfff',
      '#bbbbbb',
      '#ff9e64',
      '#f5cc36',
    ]
    const bgColors = [
      '#020617',
      '#0f172a',
      '#1e1b4b',
      '#2e1065',
      '#000000',
      '#111827',
    ]
    const shapes: BoidsProps['shape'][] = ['triangle', 'arrow', 'circle']

    if (tab === 'basic') {
      return {
        ...current,
        birdCount: Math.floor(rand(100, 500)),
        birdSize: rand(1.0, 5.0),
        speed: rand(0.5, 2.5),
        range: rand(1, 2.5),
        shape: sample(shapes),
        mode: hit(0.5) ? 'organic' : 'swarm',
      }
    }

    if (tab === 'behavior') {
      return {
        ...current,
        alignment: rand(0.2, 1.8),
        cohesion: rand(0.2, 1.8),
        separation: rand(0.5, 2.0),
        perceptionRadius: rand(30, 100),
      }
    }

    if (tab === 'appearance') {
      return {
        ...current,
        color: sample(colors),
        bgColor: sample(bgColors),
        colorMode: hit(0.3) ? 'multi' : 'single',
      }
    }

    if (tab === 'interaction') {
      return {
        ...current,
        interactive: hit(0.8),
        mouseMode: hit(0.5) ? 'repel' : 'attract',
        mouseForce: rand(0.5, 2.0),
      }
    }

    return {
      ...current,
      color: sample(colors),
      bgColor: sample(bgColors),
      colorMode: hit(0.3) ? 'multi' : 'single',
      shape: sample(shapes),
      mouseMode: hit(0.5) ? 'repel' : 'attract',
      birdCount: Math.floor(rand(100, 500)),
      birdSize: rand(1.0, 5.0),
      speed: rand(0.5, 2.5),
      range: rand(1, 2.5),
      alignment: rand(0.2, 1.8),
      cohesion: rand(0.2, 1.8),
      separation: rand(0.5, 2.0),
      perceptionRadius: rand(30, 100),
      mouseForce: rand(0.5, 2.0),
      trail: rand(0.01, 0.3),
    }
  },
  presets: [
    {
      id: 'boids_startled',
      name: { en: 'Startled Birds', 'zh-CN': '惊恐的鸟群' },
      config: {
        mode: 'organic',
        birdCount: 300,
        birdSize: 2.0,
        speed: 1.5,
        alignment: 0.3,
        cohesion: 0.2,
        separation: 2.5,
        perceptionRadius: 40,
        interactive: true,
        mouseForce: 2.0,
        mouseMode: 'repel',
        color: '#ffffff',
        bgColor: '#020617',
        colorMode: 'single',
        shape: 'arrow',
      },
    },
    {
      id: 'boids_migrating',
      name: { en: 'Migrating Birds', 'zh-CN': '南迁的候鸟' },
      config: {
        mode: 'swarm',
        birdCount: 150,
        birdSize: 3.0,
        speed: 0.8,
        alignment: 2.5,
        cohesion: 0.5,
        separation: 0.8,
        perceptionRadius: 80,
        interactive: true,
        mouseForce: 0.5,
        mouseMode: 'attract',
        color: '#7aa2f7',
        bgColor: '#020617',
        colorMode: 'single',
        shape: 'triangle',
      },
    },
    {
      id: 'boids_bait',
      name: { en: 'Circling Bait', 'zh-CN': '围着诱饵的鱼群' },
      config: {
        mode: 'swarm',
        birdCount: 400,
        birdSize: 1.8,
        speed: 1.2,
        alignment: 1.0,
        cohesion: 2.5,
        separation: 0.5,
        perceptionRadius: 60,
        interactive: true,
        mouseForce: 1.5,
        mouseMode: 'attract',
        color: '#bb9af7',
        bgColor: '#020617',
        colorMode: 'multi',
        shape: 'circle',
      },
    },
  ],
}
