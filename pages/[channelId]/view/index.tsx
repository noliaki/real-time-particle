import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export default function view(): JSX.Element {
  const canvasEl = useRef()

  useEffect(() => {
    QRCode.toCanvas(canvasEl.current, 'hoge')
  }, [])

  return <canvas ref={canvasEl}></canvas>
}
