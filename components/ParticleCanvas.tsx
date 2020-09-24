import React, { useRef, useEffect } from 'react'

import { ThreeBase } from '../modules/ThreeBase'
import { Particle } from '../modules/Particle'

// import { size } from '~/config'
// import { loadTexture } from '~/utils'
let rafId: number = null

export default function ParticleCanvas(): JSX.Element {
  const canvasEl = useRef()

  useEffect(() => {
    drawParticle(canvasEl.current)

    return () => dispose(canvasEl.current)
  }, [])

  return <canvas ref={canvasEl}></canvas>
}

function drawParticle(el: HTMLCanvasElement): void {
  const base = new ThreeBase(el)
  const particle = new Particle()

  base.addToScene(particle)

  update()

  function update() {
    particle.time++
    base.tick()
    rafId = requestAnimationFrame(() => {
      update()
    })
  }
}

function dispose(el: HTMLCanvasElement): void {
  cancelAnimationFrame(rafId)
}
