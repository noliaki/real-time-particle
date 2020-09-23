import * as Three from 'three'

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
