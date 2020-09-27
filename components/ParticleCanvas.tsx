import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

import { ThreeBase } from '../modules/ThreeBase'
import { Particle } from '../modules/Particle'

import style from './ParticleCanvas.module.scss'

// import { size } from '~/config'
import {
  loadImage,
  createCanvasFromImage,
  createCanvasFromImageData,
} from '~/utils'
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
  const toImage = (): void => {
    gsap.to(particleRef.current, {
      progress: 1,
      duration: 3,
      onComplete(): void {
        setTimeout(() => {
          gsap.to(particleRef.current, {
            progress: 0,
            duration: 3,
          })
        }, 7000)
      },
    })
  }

  const onChange = (event: React.ChangeEvent): void => {
    const file = (event.target as HTMLInputElement)?.files?.[0]

    if (file && file.type.startsWith('image')) {
      reader.readAsDataURL((event.target as HTMLInputElement).files[0])
    }

    (event.target as HTMLInputElement).value = ''
  }

  reader.addEventListener(
    'load',
    async (event: Event): Promise<void> => {
      const imgSrc: string = (event.target as FileReader).result as string
      const img: HTMLImageElement = await loadImage(imgSrc)
      particleRef.current.setTexture('color-end', createCanvasFromImage(img))
      toImage()
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
