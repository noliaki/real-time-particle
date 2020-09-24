import * as Three from 'three'
import { size } from '~/config'

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject): void => {
    const img: HTMLImageElement = new Image()

    img.addEventListener(
      'load',
      (): void => {
        resolve(img)
      },
      {
        once: true,
      }
    )

    img.addEventListener(
      'error',
      (event: Event): void => {
        reject(event)
      },
      {
        once: true,
      }
    )

    img.src = src
  })
}

export function loadTexture(src: string): Promise<Three.Texture> {
  return new Promise((resolve: (texture: Three.Texture) => void): void => {
    const textureLoader: Three.TextureLoader = new Three.TextureLoader()
    textureLoader.load(src, (texture: Three.Texture): void => {
      resolve(texture)
    })
  })
}

export function createCanvasTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')
  const imageData = context.getImageData(0, 0, size, size)

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 0] = Math.random() * 255
    imageData.data[i + 1] = Math.random() * 255
    imageData.data[i + 2] = Math.random() * 255
    imageData.data[i + 3] = 255
  }

  context.putImageData(imageData, 0, 0)

  return canvas
}
