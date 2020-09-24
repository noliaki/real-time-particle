import * as Three from 'three'
import OrbitControls from 'three-orbitcontrols'
import TrackballControls from 'three-trackballcontrols'

import { isPC } from '~/utils'

export class ThreeBase {
  public scene: Three.Scene
  public camera: Three.PerspectiveCamera
  public renderer: Three.WebGLRenderer
  public controls: OrbitControls
  public timerId: number | null

  constructor(canvasEl: HTMLCanvasElement) {
    this.timerId = null
    this.scene = new Three.Scene()
    this.camera = new Three.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      20000
    )
    this.camera.lookAt(this.scene.position)
    this.camera.position.z = 1000

    this.renderer = new Three.WebGLRenderer({
      canvas: canvasEl,
      antialias: true,
    })
    this.renderer.setClearColor(new Three.Color(0x1a202c))

    this.controls = isPC()
      ? new TrackballControls(this.camera, this.renderer.domElement)
      : new OrbitControls(this.camera, this.renderer.domElement)

    window.addEventListener(
      'resize',
      (_event: Event) => {
        this.onWinResize()
      },
      {
        passive: true,
      }
    )

    if (process.env.NODE_ENV !== 'production') {
      const axes = new Three.AxesHelper(500)
      this.addToScene(axes)
    }

    const light = new Three.AmbientLight(0xffffff)
    light.position.y = -1000
    light.position.z = 1000

    this.addToScene(light)

    this.setSize()
    this.tick()
  }

  addToScene(obj): void {
    this.scene.add(obj)
  }

  render(): void {
    this.renderer.render(this.scene, this.camera)
  }

  tick(): void {
    if (this.controls) {
      this.controls.update()
    }
    this.render()
  }

  setSize(): void {
    const width: number = window.innerWidth
    const height: number = window.innerHeight

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  onWinResize(): void {
    if (this.timerId) {
      window.clearTimeout(this.timerId)
    }

    this.timerId = window.setTimeout(() => {
      this.setSize()
    }, 300)
  }
}
