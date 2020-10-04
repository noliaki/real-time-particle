import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ThreeBase } from '../modules/ThreeBase'
import { Particle } from '../modules/Particle'
import { SocketIoEvent, useSocketIo } from '~/modules/SocketIoContext'
import { createCanvasFromImageData } from '~/utils/image'

export default function ParticleCanvas(): JSX.Element {
  const canvasEl = useRef<HTMLCanvasElement>()
  const baseRef = useRef<ThreeBase>()
  const particleRef = useRef<Particle>()
  const rafRef = useRef<number>()

  const { io, ioState } = useSocketIo()

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

  useEffect(() => {
    if (!ioState) {
      return
    }

    const { base, particle } = drawParticle(canvasEl.current)
    baseRef.current = base
    particleRef.current = particle

    io.on(SocketIoEvent.ON_CAMERA_POSITION_CHANGE, ({ x, y, z }) => {
      baseRef.current.camera.position.x = x
      baseRef.current.camera.position.y = y
      baseRef.current.camera.position.z = z
    })

    io.on(SocketIoEvent.ON_UPLOAD_IMAGE, ({ imageRate, data }) => {
      particleRef.current.imageRate = imageRate
      particleRef.current.setTexture(
        'color-end',
        createCanvasFromImageData(data)
      )
      toImage()
    })

    update()

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [ioState])

  return (
    <React.Fragment>
      <canvas ref={canvasEl}></canvas>
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
