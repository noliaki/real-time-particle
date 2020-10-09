import React, { createContext, useEffect, useContext, useState } from 'react'
import io from 'socket.io-client'

const SocketIoContext = createContext<SocketIOClient.Socket>(null)

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

export function useSocketIo(): SocketIOClient.Socket {
  return useContext(SocketIoContext)
}

export function SocketIoProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [socket] = useState<SocketIOClient.Socket>(() =>
    io.connect(process.env.NEXT_PUBLIC_SOCKET_ORIGIN)
  )

  useEffect(() => {
    return () => socket.close()
  }, [])

  return (
    <SocketIoContext.Provider value={socket}>
      {children}
    </SocketIoContext.Provider>
  )
}
