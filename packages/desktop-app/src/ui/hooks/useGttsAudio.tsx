import React, { useCallback, useEffect } from 'react'

export function useGttsAudio (text: string = '', speed: number) {
  const [ready, setReady] = React.useState(true)
  const [audioPlaying, setAudioPlaying] = React.useState(false)
  const audioRef = React.useRef({ audio: new Audio() })

  useEffect(() => {
    audioRef.current.audio.addEventListener('ended', () => {
      setAudioPlaying(false)
    })
  }, [])

  useEffect(() => {
    audioRef.current.audio.playbackRate = speed
  }, [speed])

  const play = useCallback(() => {
    audioRef.current.audio.play()
    setAudioPlaying(true)
  }, [])

  const stop = useCallback(() => {
    audioRef.current.audio.pause()
    audioRef.current.audio.currentTime = 0
    setAudioPlaying(false)
  }, [])

  const generateAudioAndPlay = useCallback(() => {
    if (text) {
      setReady(false)
      window.myAPI.makeAudio(text)
        .then(data => {
          const blob = new Blob(data, { type: 'audio/mp3' })
          const url = URL.createObjectURL(blob)

          setReady(true)
          audioRef.current.audio.pause()
          audioRef.current.audio.currentTime = 0
          audioRef.current.audio.src = url
          audioRef.current.audio.load()
          audioRef.current.audio.playbackRate = speed

          play()
        })
    }
  }, [text, play, speed])

  return {
    ready,
    audioPlaying,
    play,
    stop,
    generateAudioAndPlay,
  }
}
