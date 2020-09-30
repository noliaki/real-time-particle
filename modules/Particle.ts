import {
  Mesh,
  PlaneGeometry,
  DoubleSide,
  VertexColors,
  CanvasTexture,
} from 'three'
import {
  PrefabBufferGeometry,
  StandardAnimationMaterial,
  ShaderChunk,
} from 'three-bas'

import { size } from '~/config'
import { createCanvasTexture } from '~/utils/index'

import vertexParameters from '../glsl/vertexParameters.vert'
import vertexInit from '../glsl/vertexInit.vert'
import vertexPosition from '../glsl/vertexPosition.vert'

type CanvasArea =
  | 'position-start'
  | 'position-end'
  | 'color-start'
  | 'color-end'

export class Particle extends Mesh {
  public material: any
  public endPosition: any
  public geometry: any
  public endColor: any
  private textureSrcCanvas: HTMLCanvasElement
  private textureSrcContext: CanvasRenderingContext2D

  constructor() {
    const count: number = Math.pow(size, 2)
    const prefabGeometry = new PlaneGeometry()
    const geometry = new PrefabBufferGeometry(prefabGeometry, count)

    geometry.createAttribute('aIndex', 1, (data, index): void => {
      data[0] = index
    })

    const srcCanvas: HTMLCanvasElement = document.createElement('canvas')
    srcCanvas.width = size * 2
    srcCanvas.height = size * 2

    const srcContext: CanvasRenderingContext2D = srcCanvas.getContext('2d')
    srcContext.drawImage(createCanvasTexture(), 0, 0)
    srcContext.drawImage(createCanvasTexture(), size, 0)
    srcContext.drawImage(createCanvasTexture(), 0, size)
    srcContext.drawImage(createCanvasTexture(), size, size)

    const material = new StandardAnimationMaterial({
      side: DoubleSide,
      flatShading: true,
      vertexColors: VertexColors,
      uniforms: {
        uImageRate: { type: 'f', value: 1 },
        uTime: { type: 'f', value: 0 },
        uProgress: { type: 'f', value: 0 },
        uTex: {
          type: 't',
          value: new CanvasTexture(srcCanvas),
        },
      },
      vertexFunctions: [
        ShaderChunk.cubic_bezier,
        ShaderChunk.ease_circ_in_out,
        ShaderChunk.ease_elastic_in_out,
        ShaderChunk.ease_quad_out,
        ShaderChunk.quaternion_rotation,
      ],
      vertexParameters,
      vertexInit,
      vertexNormal: [],
      vertexPosition,
      vertexColor: ['vColor = color;'],
    })

    super(geometry, material)
    this.frustumCulled = false
    this.material = material
    this.geometry = geometry
    this.textureSrcCanvas = srcCanvas
    this.textureSrcContext = srcContext
  }

  get time(): number {
    return this.material.uniforms.uTime.value
  }

  set time(time: number) {
    this.material.uniforms.uTime.value = time
  }

  get progress(): number {
    return this.material.uniforms.uProgress.value
  }

  set progress(progress: number) {
    this.material.uniforms.uProgress.value = progress
  }

  get imageRate(): number {
    return this.material.uniforms.uImageRate.value
  }

  set imageRate(val: number) {
    this.material.uniforms.uImageRate.value = val
  }

  setTexture(area: CanvasArea, canvas: HTMLCanvasElement): void {
    if (area === 'position-start') {
      this.textureSrcContext.clearRect(0, 0, size, size)
      this.textureSrcContext.drawImage(canvas, 0, 0)
    } else if (area === 'position-end') {
      this.textureSrcContext.clearRect(0, size, size, size)
      this.textureSrcContext.drawImage(canvas, 0, size)
    } else if (area === 'color-start') {
      this.textureSrcContext.clearRect(size, 0, size, size)
      this.textureSrcContext.drawImage(canvas, size, 0)
    } else {
      this.textureSrcContext.clearRect(size, size, size, size)
      this.textureSrcContext.drawImage(canvas, size, size)
    }

    // eslint-disable-next-line
    (this.material.uniforms.uTex.value as CanvasTexture).needsUpdate = true
  }
}
