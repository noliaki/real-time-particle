import React, { useRef, useEffect } from 'react'

import { ThreeBase } from '../modules/ThreeBase'
import { Particle } from '../modules/Particle'

import style from './ParticleCanvas.module.scss'

// import { size } from '~/config'
import { loadImage } from '~/utils'
import { size } from '@/config'

export default function ParticleCanvas(): JSX.Element {
  const canvasEl = useRef<HTMLCanvasElement>()
  const baseRef = useRef<ThreeBase>()
  const particleRef = useRef<Particle>()
  const rafRef = useRef<number>()

  const reader: FileReader = new FileReader()

  const update = (): void => {
    particleRef.current.time++
    baseRef.current.tick()

    rafRef.current = requestAnimationFrame(() => {
      update()
    })
  }

  const onChange = (event: React.ChangeEvent): void => {
    const file = (event.target as HTMLInputElement)?.files?.[0]

    if (file && file.type.startsWith('image')) {
      reader.readAsDataURL((event.target as HTMLInputElement).files[0])
    }
  }

  reader.addEventListener(
    'load',
    async (event: Event): Promise<void> => {
      const imgSrc: string = (event.target as FileReader).result as string
      const img: HTMLImageElement = await loadImage(imgSrc)
      const canvas = createCanvasFromImage(img)

      canvas.style.position = 'fixed'
      canvas.style.top = '0'
      canvas.style.right = '0'

      document.body.appendChild(canvas)
    }
  )

  useEffect(() => {
    const { base, particle } = drawParticle(canvasEl.current)
    baseRef.current = base
    particleRef.current = particle

    update()

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <React.Fragment>
      <canvas ref={canvasEl}></canvas>
      <input
        type="file"
        className={style.input}
        onChange={onChange}
        accept="image/*"
      />
    </React.Fragment>
  )
}

function drawParticle(
  el: HTMLCanvasElement
): { base: ThreeBase; particle: Particle } {
  const base = new ThreeBase(el)
  const particle = new Particle()

  base.addToScene(particle)

  return { base, particle }
}

function createCanvasFromImage(img: HTMLImageElement): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  const context: CanvasRenderingContext2D = canvas.getContext('2d')
  context.drawImage(img, 0, 0)

  return canvas
}

function createCanvasFromImageData(imgData: ImageData): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  canvas.width = imgData.width
  canvas.height = imgData.height

  const context: CanvasRenderingContext2D = canvas.getContext('2d')
  context.putImageData(imgData, 0, 0)

  return canvas
}
