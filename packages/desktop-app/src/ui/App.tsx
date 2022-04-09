import './styles.css'
import { useGttsAudio } from './hooks/useGttsAudio'
import { useAudioSpeed } from './hooks/useAudioSpeed'
import { useTextarea } from './hooks/useTextarea'

export default function App () {
  const { text, textarea } = useTextarea('border-2 grow')
  const { speed, inputRange } = useAudioSpeed()
  const { ready, audioPlaying, play, stop, generateAudioAndPlay } = useGttsAudio(text, speed)

  return <div className='main'>
    {textarea}
    <div className="controls">
      <button
        onClick={() => {
          generateAudioAndPlay()
        }}
        disabled={!ready}
      >
        Generate audio
      </button>
      <button
        onClick={() => {
          if (audioPlaying) {
            stop()
          } else {
            play()
          }
        }}
        disabled={!ready}
      >{audioPlaying ? 'Stop' : 'Play'}</button>
      {inputRange}
    </div>
  </div>
}
