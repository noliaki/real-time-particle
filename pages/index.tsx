import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { SocketIoEvent, useSocketIo } from '~/modules/SocketIoContext'
import dynamic from 'next/dynamic'

const ParticleCanvas = dynamic(() => import('~/components/ParticleCanvas'), {
  ssr: false,
})

export default function Home(): JSX.Element {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const [isConnectedController, setIsConnectedController] = useState<boolean>(
    false
  )
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

  return (
    <React.Fragment>
      <ParticleCanvas></ParticleCanvas>
      {isConnectedController ? null : (
        <canvas
          ref={canvasEl}
          style={{ position: 'absolute', top: 0, left: 0 }}
        ></canvas>
      )}
    </React.Fragment>
  )
}
