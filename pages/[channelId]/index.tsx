import React from 'react'
import { useRouter } from 'next/router'

export default function channnelId(): JSX.Element {
  const router = useRouter()
  const { channelId } = router.query

  return <p>channelId: {channelId}</p>
}
