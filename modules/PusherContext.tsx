import React, { createContext, useRef, useEffect, useContext } from 'react'
import Pusher from 'pusher-js'

const PusherContext = createContext<Pusher>(null)

export const PusherEvent = {
  ON_CONNECTED_CONTROLLER: 'ON_CONNECTED_CONTROLLER',
} as const

export type PusherEvent = typeof PusherEvent[keyof typeof PusherEvent]

export function usePusher(): Pusher {
  return useContext(PusherContext)
}

export function PusherProvider(props: {
  children: React.ReactNode
}): JSX.Element {
  const clientRef = useRef<Pusher>(
    new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY)
  )

  useEffect(() => {
    return () => {
      clientRef.current.disconnect()
    }
  }, [])

  return (
    <PusherContext.Provider value={clientRef.current}>
      {props.children}
    </PusherContext.Provider>
  )
}
