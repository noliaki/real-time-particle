import dynamic from 'next/dynamic'
import React from 'react'
// import QRCode from 'qrcode'

const ParticleCanvas = dynamic(() => import('~/components/ParticleCanvas'), {
  ssr: false,
})

export default function view(): JSX.Element {
  return <ParticleCanvas />
}
