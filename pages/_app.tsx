import React from 'react'
import type { AppProps } from 'next/app'
import { SocketIoProvider } from '~/modules/SocketIoContext'

import '../styles/globals.css'

if (process.env.NODE_ENV === 'production') {
  for (const key in console) {
    console[key] = noop
  }
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SocketIoProvider>
      <div className="wrapper">
        <div className="content">
          <Component {...pageProps} />
        </div>
      </div>
    </SocketIoProvider>
  )
}

/* eslint-disable-next-line */
function noop(): void {}

export default MyApp
