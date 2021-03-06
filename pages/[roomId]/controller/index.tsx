import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSocketIo, SocketIoEvent } from '~/modules/SocketIoContext'
import dynamic from 'next/dynamic'

const ControllerCanvas = dynamic(
  () => import('~/components/ControllerCanvas'),
  {
    ssr: false,
  }
)

const ImageInput = dynamic(() => import('~/components/ImageInput'), {
  ssr: false,
})

export default function controller(): JSX.Element {
  const socket = useSocketIo()
  const router = useRouter()
  const { roomId } = router.query

  useEffect(() => {
    console.log(roomId)

    if (!roomId) {
      return
    }

    socket.on(SocketIoEvent.CONTROLLER_JOINED_ROOM, ({ roomId }) => {
      console.log(`SocketIoEvent.CONTROLLER_JOINED_ROOM: ` + roomId)
      socket.off(SocketIoEvent.CONTROLLER_JOINED_ROOM)
      socket.emit(SocketIoEvent.CONNECTED_CONTROLLER, { roomId })
    })

    socket.emit(SocketIoEvent.CONTROLLER_JOIN_ROOM, { roomId })

    return () => {
      socket.off(SocketIoEvent.CONTROLLER_JOINED_ROOM)
    }
  }, [roomId])

  return (
    <React.Fragment>
      <ImageInput></ImageInput>
      <ControllerCanvas></ControllerCanvas>
    </React.Fragment>
  )
}
