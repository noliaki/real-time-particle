import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'
import { usePusher, PusherEvent } from '~/modules/PusherContext'
import { localstorageName } from '../config'

export default function Home(): JSX.Element {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const pusher = usePusher()
  const channelId = useRef<string>(uuidv4())

  useEffect(() => {
    window.localStorage.setItem(localstorageName, channelId.current)

    pusher
      .subscribe(channelId.current)
      .bind(PusherEvent.ON_CONNECTED_CONTROLLER, ({ channelId }): void => {
        console.log('success: PUSHER')
        console.log(channelId)
      })

    console.log(channelId.current)
    QRCode.toCanvas(
      canvasEl.current,
      `/controller/${channelId.current}`,
      (error: Error): void => {
        if (error) console.error(error)
        console.log('success!')
      }
    )
  }, [pusher, channelId.current])

  function onClick(event: React.MouseEvent) {
    event.preventDefault()
    window.open(`/controller/${channelId.current}`)
  }

  return (
    <>
      {channelId.current}
      <a href="#" onClick={onClick} target="_blank" rel="noreferrer noopener">
        <canvas ref={canvasEl}></canvas>
      </a>
    </>
  )
}
