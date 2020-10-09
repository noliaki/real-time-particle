import React, { useEffect, useRef, useState } from 'react'
// import { useRouter } from 'next/router'
// import Link from 'next/link'
// import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'
import { SocketIoEvent, useSocketIo } from '~/modules/SocketIoContext'
// import { localstorageName } from '../config'
import dynamic from 'next/dynamic'
// import { waitForDebugger } from 'inspector'
// import QRCode from 'qrcode'

const ParticleCanvas = dynamic(() => import('~/components/ParticleCanvas'), {
  ssr: false,
})

const Scene = {
  BEFORE_CONNECT_WS: 'BEFORE_CONNECT_WS',
  CONNECTED_WS: 'CONNECTED_WS',
  CONNECTED_CONTROLLER: 'CONNECTED_CONTROLLER',
} as const

type Scene = typeof Scene[keyof typeof Scene]

export default function Home(): JSX.Element {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const [isConnectedController, setIsConnectedController] = useState<boolean>(
    false
  )
  // const router = useRouter()
  const socket = useSocketIo()
  const [roomId, setRoomId] = useState<string>('')

  useEffect(() => {
    socket.on(SocketIoEvent.VIEW_JOINED_ROOM, ({ roomId }) => {
      socket.off(SocketIoEvent.VIEW_JOINED_ROOM)
      console.log(`SocketIoEvent.VIEW_JOINED_ROOM: ` + roomId)
      setRoomId(roomId)
    })

    socket.on(SocketIoEvent.CONNECTED_CONTROLLER, ({ roomId }) => {
      console.log(`SocketIoEvent.CONNECTED_CONTROLLER: ` + roomId)
      socket.off(SocketIoEvent.CONNECTED_CONTROLLER)
      setIsConnectedController(true)
    })

    socket.emit(SocketIoEvent.VIEW_JOIN_ROOM)

    return () => {
      console.log('io.off(SocketIoEvent.CONNECTED_CONTROLLER)')
      socket.off(SocketIoEvent.VIEW_JOINED_ROOM)
      socket.off(SocketIoEvent.CONNECTED_CONTROLLER)
    }
  }, [])

  useEffect(() => {
    if (roomId) {
      QRCode.toCanvas(
        canvasEl.current,
        `${location.origin}/${roomId}/controller`,
        (error: Error): void => {
          if (error) console.error(error)
          console.log('success!')
        }
      )
    }
  }, [roomId])

  function onClick(event: React.MouseEvent) {
    event.preventDefault()
    window.open(`/${roomId}/controller`)
  }

  const canvas = isConnectedController ? null : (
    <a
      href="#"
      onClick={onClick}
      target="_blank"
      rel="noreferrer noopener"
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <canvas ref={canvasEl}></canvas>
    </a>
  )

  return (
    <React.Fragment>
      <ParticleCanvas></ParticleCanvas>
      {canvas}
    </React.Fragment>
  )
}
