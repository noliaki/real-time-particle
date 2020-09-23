import * as Three from 'three'
import * as Bas from 'three-bas'

import { size } from '~/config'
import { loadTexture } from '~/utils/index'

import vertexParameters from '../glsl/vertexParameters.vert'
import vertexInit from '../glsl/vertexInit.vert'
import vertexPosition from '../glsl/vertexPosition.vert'

export class Particle extends Three.Mesh {
  public material: any
  public endPosition: any
  public geometry: any
  public endColor: any

  constructor() {
    const count: number = Math.pow(size, 2)
    const prefabGeometry = new Three.PlaneGeometry()
    const geometry = new Bas.PrefabBufferGeometry(prefabGeometry, count)

    geometry.createAttribute('aIndex', 1, (data, index): void => {
      data[0] = index
    })

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size

    const context = canvas.getContext('2d')

    const imageData = context.getImageData(0, 0, size, size)

    console.log(imageData)

    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i + 0] = Math.random() * 255
      imageData.data[i + 1] = Math.random() * 255
      imageData.data[i + 2] = Math.random() * 255
      imageData.data[i + 3] = 255
    }

    context.putImageData(imageData, 0, 0)

    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'

    document.body.appendChild(canvas)

    // const texture = loadTexture(canvas.toDataURL())

    const material = new Bas.StandardAnimationMaterial({
      side: Three.DoubleSide,
      flatShading: true,
      vertexColors: Three.VertexColors,
      uniforms: {
        uTime: { type: 'f', value: 0 },
        uProgress: { type: 'f', value: 0 },
        uLoudness: { type: 'f', value: 0 },
        uStrLen: { type: 'f', value: 1 },
        uIsImage: { type: 'bool', value: false },
        uStartTexture: {
          value: new Three.Texture(canvas),
        },
      },
      vertexFunctions: [
        Bas.ShaderChunk.cubic_bezier,
        Bas.ShaderChunk.ease_circ_in_out,
        Bas.ShaderChunk.ease_elastic_in_out,
        Bas.ShaderChunk.ease_quad_out,
        Bas.ShaderChunk.quaternion_rotation,
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
  }

  get time(): number {
    return this.material.uniforms.uTime.value
  }

  set time(time: number) {
    this.material.uniforms.uTime.value = time
  }

  get uIsImage(): boolean {
    return this.material.uniforms.uIsImage.value
  }

  set uIsImage(val: boolean) {
    this.material.uniforms.uIsImage.value = val
  }

  get progress(): number {
    return this.material.uniforms.uProgress.value
  }

  set progress(progress: number) {
    this.material.uniforms.uProgress.value = progress
  }

  get loudness(): number {
    return this.material.uniforms.uLoudness.value
  }

  set loudness(loudness: number) {
    this.material.uniforms.uLoudness.value = loudness
  }

  get strLen(): number {
    return this.material.uniforms.uStrLen.value
  }

  set strLen(length: number) {
    this.material.uniforms.uStrLen.value = length
  }
}
