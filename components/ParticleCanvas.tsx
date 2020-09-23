import React, { useRef, useEffect } from 'react'

import { ThreeBase } from '../modules/ThreeBase'
import { Particle } from '../modules/Particle'

export default function ParticleCanvas(): JSX.Element {
  const canvasEl = useRef()

  useEffect(() => {
    const base = new ThreeBase(canvasEl.current)
    const particle = new Particle()
    let rafId: number

    base.addToScene(particle)
    update()

    function update() {
      particle.time++
      base.tick()
      rafId = requestAnimationFrame(() => {
        update()
      })
    }

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasEl}></canvas>
}
