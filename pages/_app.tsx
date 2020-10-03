import React from 'react'
import type { AppProps } from 'next/app'
import { SocketIoProvider } from '~/modules/SocketIoContext'

import '../styles/globals.css'

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

export default MyApp
