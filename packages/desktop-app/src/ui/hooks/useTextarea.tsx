import React, { useState } from 'react'

export function useTextarea (className: string) {
  const [text, setText] = useState('')

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const textarea = <textarea className={className} defaultValue={text} onChange={handleTextChange} />

  return { text, textarea }
}
