import React, { createContext, useRef, useEffect } from 'react'
import Pusher from 'pusher'

export const PusherContext = createContext(null)

export function PusherProvider({
  children,
  option,
  ...props
}: {
  children: JSX.Element | Element
  option?: Pusher.Options
  props?: any
}): JSX.Element {
  const clientRef = useRef(null)

  useEffect(() => {
    clientRef.current = new Pusher(option)

    return () => clientRef.current.disconnect()
  }, [clientRef, option, props])

  return (
    <PusherContext.Provider value={{ client: clientRef }} {...props}>
      {children}
    </PusherContext.Provider>
  )
}
