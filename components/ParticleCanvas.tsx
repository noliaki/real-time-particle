import React, { useRef, useEffect, useCallback } from 'react'

import { ThreeBase } from '../modules/ThreeBase'
import { Particle } from '../modules/Particle'

// import { size } from '~/config'
// import { loadTexture } from '~/utils'

export default function ParticleCanvas(): JSX.Element {
  const canvasEl = useRef<HTMLCanvasElement>()
  const baseRef = useRef<ThreeBase>()
  const particleRef = useRef<Particle>()
  const rafRef = useRef<number>()

  const update = useCallback((): void => {
    particleRef.current.time++
    baseRef.current.tick()

    rafRef.current = requestAnimationFrame(() => {
      update()
    })
  }, [])

  useEffect(() => {
    const { base, particle } = drawParticle(canvasEl.current)
    baseRef.current = base
    particleRef.current = particle

    update()

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <canvas ref={canvasEl}></canvas>
}

function drawParticle(
  el: HTMLCanvasElement
): { base: ThreeBase; particle: Particle } {
  const base = new ThreeBase(el)
  const particle = new Particle()

  base.addToScene(particle)

  return { base, particle }
}
