import React from 'react'
import type { AppProps } from 'next/app'
// import { PusherProvider } from '~/modules/PusherContext'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <div className="wrapper">
      <div className="content">
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp
