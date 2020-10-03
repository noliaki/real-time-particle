import React, { createContext, useRef, useEffect, useContext } from 'react'
import io from 'socket.io-client'

const SocketIoContext = createContext<SocketIOClient.Socket>(null)

export const SocketIoEvent = {
  ON_CONNECTED_CONTROLLER: 'ON_CONNECTED_CONTROLLER',
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

  // useEffect(() => {
  //   ioRef.current.on('connect', () => {
  //     console.log(ioRef.current)
  //   })
  // }, [])

  return (
    <SocketIoContext.Provider value={ioRef.current}>
      {props.children}
    </SocketIoContext.Provider>
  )
}
