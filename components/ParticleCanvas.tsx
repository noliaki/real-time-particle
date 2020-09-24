import React, { useRef, useEffect } from 'react'

import { ThreeBase } from '../modules/ThreeBase'
import { Particle } from '../modules/Particle'

import { size } from '~/config'
import { loadTexture } from '~/utils'

export default function ParticleCanvas(): JSX.Element {
  const canvasEl = useRef()

  useEffect(() => {
    init(canvasEl.current)
  }, [])

  return <canvas ref={canvasEl}></canvas>
}

async function init(el) {
  const base = new ThreeBase(el)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')

  const imageData = context.getImageData(0, 0, size, size)

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 0] = Math.random() * 255
    imageData.data[i + 1] = Math.random() * 0
    imageData.data[i + 2] = Math.random() * 0
    imageData.data[i + 3] = 255
  }

  context.putImageData(imageData, 0, 0)

  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'

  document.body.appendChild(canvas)

  const texture = await loadTexture(canvas.toDataURL())

  const particle = new Particle(texture)
  // let rafId: number

  base.addToScene(particle)
  update()

  function update() {
    particle.time++
    base.tick()
    requestAnimationFrame(() => {
      update()
    })
  }
}
