import React, { useEffect, useRef, useCallback } from 'react'
import { ThreeBase } from '~/modules/ThreeBase'
import { SphereGeometry, MeshBasicMaterial, Mesh } from 'three'
import { useSocketIo, SocketIoEvent } from '~/modules/SocketIoContext'
import { useRouter } from 'next/router'

export default function controllerCanvas(): JSX.Element {
  const canvasRef = useRef()
  const rafRef = useRef<number>(null)
  const baseRef = useRef<ThreeBase>(null)
  const positionRef = useRef({
    x: 0,
    y: 0,
    z: 0,
  })
  const socket = useSocketIo()
  const router = useRouter()

  const { roomId } = router.query

  const cameraMove = useCallback(
    throttle(() => {
      if (!roomId) {
        return
      }

      socket.emit(SocketIoEvent.ON_CAMERA_POSITION_CHANGE, {
        roomId,
        ...positionRef.current,
      })
    }, 50),
    [roomId]
  )

  const update = useCallback((): void => {
    baseRef.current.tick()

    if (
      roomId &&
      positionRef.current?.x !== baseRef.current.camera.position.x &&
      positionRef.current?.y !== baseRef.current.camera.position.y &&
      positionRef.current?.z !== baseRef.current.camera.position.z
    ) {
      positionRef.current = {
        x: baseRef.current.camera.position.x,
        y: baseRef.current.camera.position.y,
        z: baseRef.current.camera.position.z,
      }

      cameraMove()
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      update()
    })
  }, [roomId])

  useEffect(() => {
    baseRef.current = drawCanvas(canvasRef.current)
    cancelAnimationFrame(rafRef.current)
    update()

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <canvas ref={canvasRef}></canvas>
}

function drawCanvas(el: HTMLCanvasElement): ThreeBase {
  const base = new ThreeBase(el)
  const geometry = new SphereGeometry(200, 20, 20)
  const material = new MeshBasicMaterial({ color: 0x00aaff, wireframe: true })
  const sphere = new Mesh(geometry, material)
  base.addToScene(sphere)

  return base
}

function throttle(fn: (...args) => void, interval): () => void {
  let prevTimestamp = 0

  return (...args): void => {
    if (!prevTimestamp) {
      prevTimestamp = Date.now()
    }

    const now = Date.now()

    if (now - prevTimestamp >= interval) {
      prevTimestamp = now
      fn(...args)
    }
  }
}
