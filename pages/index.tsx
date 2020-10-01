import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'
import { localstorageName } from '../config'

export default function Home(): JSX.Element {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const channelId = uuidv4()

  useEffect(() => {
    window.localStorage.setItem(localstorageName, channelId)
    // router.push({
    //   pathname: '/[channelId]',
    //   query: { channelId },
    // })

    QRCode.toCanvas(
      canvasEl.current,
      `/${channelId}/controller`,
      (error: Error): void => {
        if (error) console.error(error)
        console.log('success!')
      }
    )
  }, [])

  return (
    <Link href={`/${channelId}/view`}>
      <canvas ref={canvasEl}></canvas>
    </Link>
  )
}
