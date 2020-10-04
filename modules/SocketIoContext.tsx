import React, {
  createContext,
  useRef,
  useEffect,
  useContext,
  useState,
} from 'react'
import io from 'socket.io-client'

const SocketIoContext = createContext<{
  io: SocketIOClient.Socket
  ioState: boolean
}>(null)

export const SocketIoEvent = {
  VIEW_JOIN_ROOM: 'VIEW_JOIN_ROOM',
  VIEW_JOINED_ROOM: 'VIEW_JOINED_ROOM',
  CONTROLLER_JOIN_ROOM: 'CONTROLLER_JOIN_ROOM',
  CONTROLLER_JOINED_ROOM: 'CONTROLLER_JOINED_ROOM',
  ON_CAMERA_POSITION_CHANGE: 'ON_CAMERA_POSITION_CHANGE',
  ON_UPLOAD_IMAGE: 'ON_UPLOAD_IMAGE',

  CONNECTED_CONTROLLER: 'CONNECTED_CONTROLLER',
  MOVE_CAMERA: 'MOVE_CAMERA',
  DEVICE_ORIENTATION: 'DEVICE_ORIENTATION',
} as const

export type SocketIoEvent = typeof SocketIoEvent[keyof typeof SocketIoEvent]

export function useSocketIo(): { io: SocketIOClient.Socket; ioState: boolean } {
  return useContext(SocketIoContext)
}

export function SocketIoProvider(props: {
  children: React.ReactNode
}): JSX.Element {
  const ioRef = useRef<SocketIOClient.Socket>(
    io(process.env.NEXT_PUBLIC_SOCKET_ORIGIN)
  )

  const [ioState, setIoState] = useState<boolean>()

  ioRef.current.on('connect', () => {
    console.log(ioRef.current.connected)
    setIoState(ioRef.current.connected)
  })

  useEffect(() => {
    return () => ioRef.current.close()
  }, [])

  return (
    <SocketIoContext.Provider value={{ io: ioRef.current, ioState }}>
      {props.children}
    </SocketIoContext.Provider>
  )
}
