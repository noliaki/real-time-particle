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
  const { io, ioState } = useSocketIo()
  const router = useRouter()
  const { roomId } = router.query

  // const onDeviceOrientation = (event: DeviceOrientationEvent): void => {
  //   if (!ioState) {
  //     return
  //   }

  //   io.emit(SocketIoEvent.DEVICE_ORIENTATION, {
  //     roomId,
  //     alpha: event.alpha,
  //     beta: event.beta,
  //     gamma: event.gamma,
  //   })
  // }

  useEffect(() => {
    if (!ioState || !roomId) {
      return
    }

    io.on(SocketIoEvent.CONTROLLER_JOINED_ROOM, ({ roomId }) => {
      console.log(`SocketIoEvent.CONTROLLER_JOINED_ROOM: ` + roomId)
      io.emit(SocketIoEvent.CONNECTED_CONTROLLER, { roomId })
    })

    io.emit(SocketIoEvent.CONTROLLER_JOIN_ROOM, { roomId })
  }, [roomId, ioState])

  // useEffect(() => {
  //   window.addEventListener('deviceorientation', onDeviceOrientation)

  //   return () => {
  //     window.removeEventListener('deviceorientation', onDeviceOrientation)
  //   }
  // }, [])

  return (
    <React.Fragment>
      <ImageInput></ImageInput>
      <ControllerCanvas></ControllerCanvas>
    </React.Fragment>
  )
}