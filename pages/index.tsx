import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
// import Link from 'next/link'
// import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'
import { SocketIoEvent, useSocketIo } from '~/modules/SocketIoContext'
// import { localstorageName } from '../config'

export default function Home(): JSX.Element {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const io = useSocketIo()
  const [roomId, setRoomId] = useState<string>('')

  useEffect(() => {
    io.on('connect', () => {
      io.emit(SocketIoEvent.VIEW_JOIN_ROOM)
    })

    io.on(SocketIoEvent.VIEW_JOINED_ROOM, ({ roomId }) => {
      console.log(`SocketIoEvent.VIEW_JOINED_ROOM: ` + roomId)
      setRoomId(roomId)
    })

    io.on(SocketIoEvent.CONNECTED_CONTROLLER, ({ roomId }) => {
      console.log(`SocketIoEvent.CONNECTED_CONTROLLER: ` + roomId)

      io.off(SocketIoEvent.CONNECTED_CONTROLLER)

      router.push(`/${roomId}/view`)
    })
  }, [io])

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

  return (
    <>
      <a href="#" onClick={onClick} target="_blank" rel="noreferrer noopener">
        <canvas ref={canvasEl}></canvas>
      </a>
    </>
  )
}
