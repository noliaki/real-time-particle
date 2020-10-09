import React, { useEffect, useCallback } from 'react'
import { useSocketIo, SocketIoEvent } from '~/modules/SocketIoContext'
import { loadImage, createCanvasFromImage } from '~/utils/image'
import { useRouter } from 'next/router'
import style from './ImageInput.module.scss'

export default function imageInput(): JSX.Element {
  const fileReader = new FileReader()
  const socket = useSocketIo()
  const router = useRouter()
  const { roomId } = router.query

  const onLoadFile = useCallback(
    async (event: Event): Promise<void> => {
      const imgSrc: string = (event.target as FileReader).result as string
      const img: HTMLImageElement = await loadImage(imgSrc)
      const imgCanvas: HTMLCanvasElement = createCanvasFromImage(img)
      const imgCanvasContext: CanvasRenderingContext2D = imgCanvas.getContext(
        '2d'
      )
      const imgData = imgCanvasContext.getImageData(
        0,
        0,
        imgCanvas.width,
        imgCanvas.height
      )

      if (roomId) {
        socket.emit(SocketIoEvent.ON_UPLOAD_IMAGE, {
          roomId,
          imageRate: img.naturalHeight / img.naturalWidth,
          data: Array.from(imgData.data),
        })
      }
    },
    [roomId]
  )

  const onChange = (event: React.ChangeEvent): void => {
    const target = event.target as HTMLInputElement
    const file = target?.files?.[0]

    if (file && file.type.startsWith('image')) {
      fileReader.readAsDataURL(target.files[0])
    }

    target.value = ''
  }

  useEffect(() => {
    fileReader.addEventListener('load', onLoadFile)

    return () => {
      fileReader.removeEventListener('load', onLoadFile)
    }
  }, [])
  return (
    <input
      type="file"
      className={style.input}
      onChange={onChange}
      accept="image/*"
    ></input>
  )
}
