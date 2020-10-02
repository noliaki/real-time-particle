import React, { createContext, useRef, useEffect, useContext } from 'react'
import Pusher from 'pusher-js'

const PusherContext = createContext<Pusher>(null)

export function usePusher(): Pusher {
  return useContext(PusherContext)
}

export function PusherProvider(props: {
  children: React.ReactNode
}): JSX.Element {
  const clientRef = useRef<Pusher>(null)

  console.log(process.env.NEXT_PUBLIC_PUSHER_KEY)

  useEffect(() => {
    clientRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY)

    return () => {
      clientRef.current.disconnect()
    }
  }, [clientRef, props])

  return (
    <PusherContext.Provider value={clientRef.current}>
      {props.children}
    </PusherContext.Provider>
  )
}
