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
  const timerIdRef = useRef<number>(0)

  const socket = useSocketIo()

  const update = (): void => {
    particleRef.current.time++
    baseRef.current.tick()

    rafRef.current = requestAnimationFrame(() => {
      update()
    })
  }

  const toImage = (): void => {
    console.log('toImage')

    gsap.to(particleRef.current, {
      progress: 1,
      duration: 3,
      onComplete(): void {
        window.clearTimeout(timerIdRef.current)

        timerIdRef.current = window.setTimeout(() => {
          gsap.to(particleRef.current, {
            progress: 0,
            duration: 3,
          })
        }, 7000)
      },
    })
  }

  useEffect(() => {
    const { base, particle } = drawParticle(canvasEl.current)
    baseRef.current = base
    particleRef.current = particle

    socket.on(SocketIoEvent.ON_CAMERA_POSITION_CHANGE, ({ x, y, z }) => {
      console.log('SocketIoEvent.ON_CAMERA_POSITION_CHANGE')

      gsap.to(baseRef.current.camera.position, {
        x,
        y,
        z,
      })
    })

    socket.on(SocketIoEvent.ON_UPLOAD_IMAGE, ({ imageRate, data }) => {
      console.log('SocketIoEvent.ON_UPLOAD_IMAGE')

      particleRef.current.imageRate = imageRate
      particleRef.current.setTexture(
        'color-end',
        createCanvasFromImageData(data)
      )
      toImage()
    })

    cancelAnimationFrame(rafRef.current)
    update()

    return () => {
      cancelAnimationFrame(rafRef.current)
      socket.off(SocketIoEvent.ON_CAMERA_POSITION_CHANGE)
      socket.off(SocketIoEvent.ON_UPLOAD_IMAGE)
      particleRef.current.progress = 0
      baseRef.current.dispose()
      particleRef.current.dispose()
      baseRef.current = null
      particleRef.current = null
    }
  }, [])

  return <canvas ref={canvasEl}></canvas>
}

function drawParticle(
  el: HTMLCanvasElement
): { base: ThreeBase; particle: Particle } {
  console.log('drawParticle')

  const base = new ThreeBase(el)
  const particle = new Particle()

  base.addToScene(particle)

  return { base, particle }
}
