import React, { createContext, useRef, useEffect, useContext } from 'react'
import io from 'socket.io-client'

const SocketIoContext = createContext<SocketIOClient.Socket>(null)

export const SocketIoEvent = {
  CONNECTED_CONTROLLER: 'CONNECTED_CONTROLLER',
  MOVE_CAMERA: 'MOVE_CAMERA',
  ORIENTATION_CHANGE: 'ORIENTATION_CHANGE',
  JOIN_ROOM: 'JOIN_ROOM',
} as const

export type SocketIoEvent = typeof SocketIoEvent[keyof typeof SocketIoEvent]

export function useSocketIo(): SocketIOClient.Socket {
  return useContext(SocketIoContext)
}

export function SocketIoProvider(props: {
  children: React.ReactNode
}): JSX.Element {
  const ioRef = useRef<SocketIOClient.Socket>(
    io(process.env.NEXT_PUBLIC_SOCKET_ORIGIN)
  )

  useEffect(() => {
    return () => ioRef.current.close()
  }, [])

  return (
    <SocketIoContext.Provider value={ioRef.current}>
      {props.children}
    </SocketIoContext.Provider>
  )
}
