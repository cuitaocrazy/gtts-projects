import React, { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'

function speedConventer (rangeValue: string) {
  return (parseInt(rangeValue) + 1) / 10
}

function speedCoconventer (speed: number) {
  return (speed * 10) - 1
}

// `stepDown` 和 `stepUp` 不触发onChange事件，因此带上 `setSpeed` 函数，如果不用ref，代码会更好看点，但还要算speed的值域，没采用。
function useKeyboard (range: React.RefObject<HTMLInputElement>, setSpeed: React.Dispatch<React.SetStateAction<number>>) {
  const onKeyDownHandler = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof Element && e.target.tagName === 'TEXTAREA') {
      return
    }

    if (e.key === 'ArrowLeft') {
      range.current!.stepDown()
      setSpeed(speedConventer(range.current!.value))
    } else if (e.key === 'ArrowRight') {
      range.current!.stepUp()
      setSpeed(speedConventer(range.current!.value))
    }
  }, [range, setSpeed])

  useEffect(() => {
    window.addEventListener('keydown', onKeyDownHandler)

    return () => {
      window.removeEventListener('keydown', onKeyDownHandler)
    }
  }, [onKeyDownHandler])
}

export function useAudioSpeed () {
  const [speed, setSpeed] = useState(1)
  const inputRef = React.useRef<HTMLInputElement>(null)

  useKeyboard(inputRef, setSpeed)

  function handleSpeedChange (e: React.ChangeEvent<HTMLInputElement>) {
    setSpeed(speedConventer(e.target.value))
  }

  const inputClass = classNames('border-2', 'rounded')

  const inputRange = <div className="flex items-center">
      <input ref={inputRef} type="range" defaultValue={speedCoconventer(speed)} className={inputClass} min="0" max="19" onChange={handleSpeedChange}></input>
      <span className="text-xs w-8">{speed}x</span>
    </div>

  return { speed, inputRange }
}
