import { Color, Geometry, Mesh, Program, Renderer, Camera, Vec2 } from 'ogl'
import { defu } from 'defu'
import { meta } from '../meta'
import type { BoidsEngineConfig } from '../types'
import vertexShader from './shaders/vertex.glsl?raw'
import fragmentShader from './shaders/fragment.glsl?raw'

export class BoidsEngine {
  renderer: Renderer
  gl: any
  camera: Camera
  program: Program
  mesh: Mesh
  raf: number = 0
  container: HTMLElement
  private ro?: ResizeObserver
  private t0: number = performance.now()
  private _isPaused = false
  private pausedTime = 0
  private pauseStartTime = 0
  private config: BoidsEngineConfig
  private mouse = new Vec2(-1000, -1000)
  private baseColorObj = new Color()
  
  // Boids data
  private positions!: Float32Array
  private velocities!: Float32Array
  private instanceDataArray!: Float32Array
  private instanceColorArray!: Float32Array
  
  // Spatial Partitioning (Grid)
  private grid!: Int32Array
  private head!: Int32Array
  private numCellsX: number = 0
  private numCellsY: number = 0
  private readonly cellSize = 50

  constructor(container: HTMLElement, config: BoidsEngineConfig) {
    this.container = container
    this.config = defu(config, meta.defaultConfig) as BoidsEngineConfig

    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      webgl: 2
    })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)

    this.camera = new Camera(this.gl)
    this.initBoids()
    
    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      transparent: true,
    })

    const geometry = this.createGeometry()
    this.mesh = new Mesh(this.gl, { geometry, program: this.program })
    this.mesh.frustumCulled = false

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(this.container)
    this.resize()

    window.addEventListener('pointermove', this.handlePointerMove)
    window.addEventListener('pointerleave', this.handlePointerLeave)
    this.loop(this.t0)
  }

  private handlePointerMove = (e: PointerEvent) => {
    const rect = this.container.getBoundingClientRect()
    this.mouse.set(e.clientX - rect.left, e.clientY - rect.top)
  }

  private handlePointerLeave = () => {
    this.mouse.set(-1000, -1000)
  }

  private setRgbFromHsl(out: Float32Array, offset: number, h: number, s: number, l: number) {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    const hue2rgb = (t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    out[offset] = hue2rgb(h + 1 / 3)
    out[offset + 1] = hue2rgb(h)
    out[offset + 2] = hue2rgb(h - 1 / 3)
  }

  private initBoids() {
    const count = this.config.birdCount
    this.positions = new Float32Array(count * 2)
    this.velocities = new Float32Array(count * 2)
    this.instanceDataArray = new Float32Array(count * 4)
    this.instanceColorArray = new Float32Array(count * 3)
    this.grid = new Int32Array(count)

    const s = this.config.speed

    const width = this.gl.canvas.width || this.container.clientWidth || window.innerWidth
    const height = this.gl.canvas.height || this.container.clientHeight || window.innerHeight

    for (let i = 0; i < count; i++) {
      this.positions[i * 2] = (Math.random() - 0.5) * width
      this.positions[i * 2 + 1] = (Math.random() - 0.5) * height

      const angle = Math.random() * Math.PI * 2
      this.velocities[i * 2] = Math.cos(angle) * s
      this.velocities[i * 2 + 1] = Math.sin(angle) * s
      
    }
  }

  private createGeometry() {
    let positionData: Float32Array
    let indexData: Uint16Array | undefined

    if (this.config.shape === 'arrow') {
      positionData = new Float32Array([-1.2, -1, 1.8, 0, -1.2, 1, -0.6, 0])
      indexData = new Uint16Array([0, 1, 3, 1, 2, 3])
    } else if (this.config.shape === 'circle') {
      positionData = new Float32Array([
        0, 0, 1, 0, 0.5, 0.86, -0.5, 0.86, -1, 0, -0.5, -0.86, 0.5, -0.86,
      ])
      indexData = new Uint16Array([
        0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1,
      ])
    } else {
      positionData = new Float32Array([-1, -1, 2, 0, -1, 1])
    }

    const attributes: any = {
      position: { size: 2, data: positionData },
      uv: { size: 2, data: new Float32Array(positionData.length) },
      instanceData: { instanced: 1, size: 4, data: this.instanceDataArray },
      instanceColor: { instanced: 1, size: 3, data: this.instanceColorArray },
    }

    if (indexData) {
      attributes.index = { data: indexData }
    }

    return new Geometry(this.gl, attributes)
  }

  private updateBoids() {
    const count = this.config.birdCount
    const { 
      alignment, cohesion, separation, perceptionRadius, speed, range,
      interactive, mouseForce, mouseMode, colorMode, color 
    } = this.config
    
    const width = this.gl.canvas.width
    const height = this.gl.canvas.height
    const halfW = width / 2
    const halfH = height / 2

    this.baseColorObj.set(color)
    const br = this.baseColorObj.r
    const bg = this.baseColorObj.g
    const bb = this.baseColorObj.b
    
    const pRadiusSq = perceptionRadius * perceptionRadius
    const closeRadiusSq = (perceptionRadius * 0.5) * (perceptionRadius * 0.5)
    const mouseLimitSq = 60000

    // 1. Build Grid
    this.numCellsX = Math.ceil(width / this.cellSize) + 1
    this.numCellsY = Math.ceil(height / this.cellSize) + 1
    const totalCells = this.numCellsX * this.numCellsY
    
    if (!this.head || this.head.length !== totalCells) {
      this.head = new Int32Array(totalCells)
    }
    this.head.fill(-1)

    for (let i = 0; i < count; i++) {
      const gx = Math.floor((this.positions[i * 2] + halfW) / this.cellSize)
      const gy = Math.floor((this.positions[i * 2 + 1] + halfH) / this.cellSize)
      if (gx >= 0 && gx < this.numCellsX && gy >= 0 && gy < this.numCellsY) {
        const cellIdx = gy * this.numCellsX + gx
        this.grid[i] = this.head[cellIdx]
        this.head[cellIdx] = i
      } else {
        this.grid[i] = -1
      }
    }

    // 2. Update Boids
    for (let i = 0; i < count; i++) {
      let avgVelX = 0, avgVelY = 0, avgPosX = 0, avgPosY = 0, closeX = 0, closeY = 0
      let neighbors = 0

      const px = this.positions[i * 2]
      const py = this.positions[i * 2 + 1]
      const vx = this.velocities[i * 2]
      const vy = this.velocities[i * 2 + 1]

      const gx = Math.floor((px + halfW) / this.cellSize)
      const gy = Math.floor((py + halfH) / this.cellSize)

      for (let ny = -1; ny <= 1; ny++) {
        for (let nx = -1; nx <= 1; nx++) {
          const cx = gx + nx
          const cy = gy + ny
          if (cx < 0 || cx >= this.numCellsX || cy < 0 || cy >= this.numCellsY) continue
          
          let j = this.head[cy * this.numCellsX + cx]
          while (j !== -1) {
            if (i !== j) {
              const dx = this.positions[j * 2] - px
              const dy = this.positions[j * 2 + 1] - py
              const d2 = dx * dx + dy * dy

              if (d2 < pRadiusSq) {
                avgVelX += this.velocities[j * 2]
                avgVelY += this.velocities[j * 2 + 1]
                avgPosX += this.positions[j * 2]
                avgPosY += this.positions[j * 2 + 1]

                if (d2 < closeRadiusSq) {
                  closeX += px - this.positions[j * 2]
                  closeY += py - this.positions[j * 2 + 1]
                }
                neighbors++
              }
            }
            j = this.grid[j]
          }
        }
      }

      if (neighbors > 0) {
        const invNeighbors = 1.0 / neighbors
        avgVelX *= invNeighbors
        avgVelY *= invNeighbors
        avgPosX *= invNeighbors
        avgPosY *= invNeighbors

        const modeFactor = this.config.mode === 'swarm' ? 1.5 : 1.0

        this.velocities[i * 2] += (avgVelX - vx) * 0.05 * alignment * modeFactor
        this.velocities[i * 2 + 1] += (avgVelY - vy) * 0.05 * alignment * modeFactor

        this.velocities[i * 2] += (avgPosX - px) * 0.005 * cohesion * modeFactor
        this.velocities[i * 2 + 1] += (avgPosY - py) * 0.005 * cohesion * modeFactor

        this.velocities[i * 2] += closeX * 0.05 * separation
        this.velocities[i * 2 + 1] += closeY * 0.05 * separation
      }

      if (interactive) {
        const mdx = (this.mouse.x - halfW) - px
        const mdy = (halfH - this.mouse.y) - py
        const md2 = mdx * mdx + mdy * mdy
        if (md2 < mouseLimitSq) {
          const factor = (mouseMode === 'repel' ? -1 : 1) * 0.02 * mouseForce
          this.velocities[i * 2] += mdx * factor
          this.velocities[i * 2 + 1] += mdy * factor
        }
      }

      const margin = range > 1 ? 100 : 0
      const rangeW = halfW * Math.max(1, range)
      const rangeH = halfH * Math.max(1, range)
      if (this.positions[i * 2] < -rangeW - margin) this.positions[i * 2] = rangeW + margin
      else if (this.positions[i * 2] > rangeW + margin) this.positions[i * 2] = -rangeW - margin
      
      if (this.positions[i * 2 + 1] < -rangeH - margin) this.positions[i * 2 + 1] = rangeH + margin
      else if (this.positions[i * 2 + 1] > rangeH + margin) this.positions[i * 2 + 1] = -rangeH - margin

      // Limit speed
      const nvx = this.velocities[i * 2]
      const nvy = this.velocities[i * 2 + 1]
      const currentSpeed = Math.sqrt(nvx * nvx + nvy * nvy) || 0.0001

      const actualMaxSpeed = 5 * speed
      if (currentSpeed > actualMaxSpeed) {
        const ratio = actualMaxSpeed / currentSpeed
        this.velocities[i * 2] *= ratio
        this.velocities[i * 2 + 1] *= ratio
      }

      this.positions[i * 2] += this.velocities[i * 2]
      this.positions[i * 2 + 1] += this.velocities[i * 2 + 1]

      const angle = Math.atan2(this.velocities[i * 2 + 1], this.velocities[i * 2])
      const baseIdx4 = i * 4
      this.instanceDataArray[baseIdx4] = this.positions[i * 2]
      this.instanceDataArray[baseIdx4 + 1] = this.positions[i * 2 + 1]
      this.instanceDataArray[baseIdx4 + 2] = angle
      this.instanceDataArray[baseIdx4 + 3] = (this.config.birdSize || 2.5) * 5

      const baseIdx3 = i * 3
      if (colorMode === 'multi') {
        const hue = (angle + Math.PI) / (Math.PI * 2)
        this.setRgbFromHsl(this.instanceColorArray, baseIdx3, hue, 0.8, 0.6)
      } else {
        this.instanceColorArray[baseIdx3] = br
        this.instanceColorArray[baseIdx3 + 1] = bg
        this.instanceColorArray[baseIdx3 + 2] = bb
      }
    }

    this.mesh.geometry.attributes.instanceData.data.set(this.instanceDataArray)
    this.mesh.geometry.attributes.instanceData.needsUpdate = true
    this.mesh.geometry.attributes.instanceColor.data.set(this.instanceColorArray)
    this.mesh.geometry.attributes.instanceColor.needsUpdate = true
  }

  resize() {
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    this.renderer.setSize(width, height)
    this.gl.canvas.style.width = `${width}px`
    this.gl.canvas.style.height = `${height}px`
    
    if (this.camera) {
      this.camera.orthographic({
        left: -this.gl.canvas.width / 2,
        right: this.gl.canvas.width / 2,
        bottom: -this.gl.canvas.height / 2,
        top: this.gl.canvas.height / 2,
        near: -1,
        far: 1,
      })
    }
  }

  updateConfig(config: Partial<BoidsEngineConfig>) {
    const oldBirdCount = this.config.birdCount
    const oldShape = this.config.shape
    this.config = { ...this.config, ...config }

    if (this.config.birdCount !== oldBirdCount || this.config.shape !== oldShape) {
      this.initBoids()
      this.mesh.geometry = this.createGeometry()
    }
  }

  private loop = (time: number) => {
    this.raf = requestAnimationFrame(this.loop)
    if (this._isPaused) return

    this.updateBoids()
    this.renderer.render({ scene: this.mesh, camera: this.camera })
  }

  pause() {
    if (!this._isPaused) {
      this._isPaused = true
      this.pauseStartTime = performance.now()
    }
  }

  resume() {
    if (this._isPaused) {
      this._isPaused = false
      this.pausedTime += performance.now() - this.pauseStartTime
    }
  }

  restart() {
    this.pausedTime = 0
    this.pauseStartTime = 0
    this.t0 = performance.now()
    this.initBoids()
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf)
    if (this.ro) this.ro.disconnect()
    window.removeEventListener('pointermove', this.handlePointerMove)
    window.removeEventListener('pointerleave', this.handlePointerLeave)
    if (this.container.contains(this.gl.canvas)) {
      this.container.removeChild(this.gl.canvas)
    }
    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
