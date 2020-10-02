import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { usePusher, PusherEvent } from '~/modules/PusherContext'

export default function controller(): JSX.Element {
  const pusher = usePusher()
  const router = useRouter()
  const { channelId } = router.query
  // console.log(router)
  // const { channelId } = router.query
  // console.log(router)

  useEffect(() => {
    if (!channelId) {
      return
    }

    console.log(pusher)

    pusher
      .subscribe(channelId as string)
      .trigger(`client-${PusherEvent.ON_CONNECTED_CONTROLLER}`, {
        channelId,
      })
  }, [channelId])

  return <div>controller: </div>
}
